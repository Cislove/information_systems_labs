package se.ifmo.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import se.ifmo.common.placemark.AbstractRepository;
import se.ifmo.common.placemark.Dto;
import se.ifmo.errors.NotFoundException;
import se.ifmo.errors.SearchException;
import se.ifmo.imports.IndexDocument;
import se.ifmo.imports.OpenSearchService;
import se.ifmo.notification.NotificationService;

import java.util.*;

@RequiredArgsConstructor
@Slf4j
public abstract class AbstractCrudService<
        TEntity extends AbstractEntity<TId>,
        TRepository extends AbstractRepository<TEntity, TId>,
        TDto extends Dto,
        TMapper extends GenericMapper<TDto, TEntity>,
        TId
        > {

    protected final TRepository repository;
    private final TMapper mapper;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private OpenSearchService openSearchService;
    @Autowired
    private ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public TDto getById(TId id) {
        var dto = repository.findById(id).orElseThrow(() ->
                new NotFoundException("Entity with id: " + id + "not found"));
        return mapper.toDto(dto);
    }

    public Page<TDto> searchByValueInField(Map<String, String> fieldAndValue, Pageable pageable) {
        validateSearchFields(fieldAndValue.keySet().stream().toList());
        convertSearchFields(fieldAndValue);

        try{
            Specification<TEntity> spec = createEqualsSpecification(fieldAndValue);
            return repository.findAll(spec, pageable).map(mapper::toDto);
        }
        catch (ConstraintViolationException ex){
            throw new SearchException("Invalid search query: " + ex.getMessage());
        }
    }

    public Page<TDto> searchAggregated(
            Map<String, String> fieldAndValue,
            Pageable pageable
    ){
        Page<TDto> dbPage = searchByValueInField(fieldAndValue, pageable);
        List<TDto> dbResults = dbPage.getContent();
        List<IndexDocument> osResults = new ArrayList<>();
        List<TDto> osResultsPayload = new ArrayList<>();

        try {
            osResults = openSearchService.searchByExactMatch(
                    getEntityName(),
                    fieldAndValue
            );
            osResultsPayload = osResults.stream()
                    .map(doc -> objectMapper.convertValue(doc.getPayload(), getDtoClass()))
                    .toList();
        }
        catch (Exception _){

        }

        List<TDto> results = new ArrayList<>(dbResults);

        for(int i = 0; i < osResults.size(); i++){
            results.add(osResultsPayload.get(i));
        }

        int start = dbPage.getContent().isEmpty() ? ((int) (pageable.getOffset() - dbPage.getTotalElements())) : 0;
        int end = Math.min(start + pageable.getPageSize(), results.size());
        List<TDto> pageContent = results.subList(start, end);

        return new PageImpl<>(pageContent, pageable, dbPage.getTotalElements() + osResults.size());
    }

    @Transactional(readOnly = true)
    public Page<TDto> getAll(Pageable pageable) {
        return searchAggregated(Map.of(), pageable);
    }

    @Transactional()
    public TId save(TEntity entity){
        entity.setId(null);
        entity = repository.save(entity);
        return entity.getId();
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = IllegalArgumentException.class)
    public TId create(TDto dto) {
        try {
            var entity = mapper.toEntity(dto);
            var id = save(entity);
            notificationService.sendAddNotification(
                    entity.getStringId(),
                    getEntityName(),
                    false);

            return id;
        }
        catch (DataIntegrityViolationException | ConstraintViolationException e) {
            System.out.println(e.getMessage());
            log.atWarn().setMessage(e.getMessage()).log();
            throw new IllegalArgumentException("incorrect value/values");
        }
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void update(TDto dto) {
        try {
            TEntity entity = mapper.toEntity(dto);
            checkIdExists(entity.getId());
            var id = repository.save(entity);
            notificationService.sendUpdateNotification(
                    id.getStringId(),
                    getEntityName(),
                    false);
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            throw new IllegalArgumentException("incorrect value/values");
        }
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void delete(TId id) {
        checkIdExists(id);
        repository.deleteById(id);
        notificationService.sendDeleteNotification(id.toString(), getEntityName(), false);
    }

    //TODO как переработать, хотя бы на конфиг
    public abstract String getEntityName();

    private void checkIdExists(TId id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Entity with id " + id + " not found");
        }
    }

    private void validateSearchFields(List <String> fields) {
        for (String field : fields) {
            if (!(getFieldMapping().containsKey(field) &&
                    getAllowedSearchFields().contains(getFieldMapping().get(field)))) {
                throw new IllegalArgumentException("Invalid search field: " + field);
            }
        }
    }

    private void convertSearchFields(Map <String, String> fieldAndValue) {
        var keySet = Set.copyOf(fieldAndValue.keySet());
        for (String field : keySet) {
            if (getFieldMapping().containsKey(field)) {
                String mappedField = getFieldMapping().get(field);
                String value = fieldAndValue.remove(field);
                fieldAndValue.put(mappedField, value);
            }
        }
    }

    private Specification<TEntity> createEqualsSpecification(Map <String, String> fieldAndValue) {
        return (root, _, criteriaBuilder) -> {
            if (fieldAndValue == null || fieldAndValue.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            for (Map.Entry<String, String> entry : fieldAndValue.entrySet()) {
                String field = entry.getKey();
                String value = entry.getValue();

                try {
                    Path<?> path = root;
                    for (String part : field.split("\\.")) {
                        path = path.get(part);
                    }

                    Object typedValue = convertValue(value, path.getJavaType());

                    predicates.add(criteriaBuilder.equal(path, typedValue));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Field '" + field + "' not found");
                }
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Object convertValue(Object value, Class<?> targetType) {
        if (value == null) return null;

        if (targetType.equals(Long.class)) {
            return Long.parseLong(value.toString());
        } else if (targetType.equals(Integer.class)) {
            return Integer.parseInt(value.toString());
        } else if (targetType.equals(Double.class)) {
            return Double.parseDouble(value.toString());
        } else if (targetType.equals(Boolean.class)) {
            return Boolean.parseBoolean(value.toString());
        }

        return value.toString();
    }

    protected Map<String, String> getAllowedSearchFieldsWithLabels(){
        return Map.of();
    }

    protected Set<String> getAllowedSearchFields(){
        return Set.of();
    }

    protected Map<String, String> getFieldMapping(){
        return Map.of();
    }

    protected abstract Class<TDto> getDtoClass();
}
