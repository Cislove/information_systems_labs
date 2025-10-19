package se.ifmo.common;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import se.ifmo.common.placemark.AbstractRepository;
import se.ifmo.common.placemark.Dto;
import se.ifmo.errors.NotFoundException;
import se.ifmo.errors.SearchException;
import se.ifmo.notification.NotificationService;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
public abstract class AbstractCrudService<
        TEntity extends AbstractEntity<TId>,
        TRepository extends AbstractRepository<TEntity, TId>,
        TDto extends Dto,
        TMapper extends GenericMapper<TDto, TEntity>,
        TId
        > {

    private final TRepository repository;
    private final TMapper mapper;
    @Autowired
    private NotificationService notificationService;

    public TDto getById(TId id) {
        var dto = repository.findById(id).orElseThrow(() ->
                new NotFoundException("Entity with id: " + id + "not found"));
        return mapper.toDto(dto);
    }

    public Page<TDto> searchByValueInField(String field, String value, Pageable pageable) {
        validateSearchFields(field);
        try{
            String mappingField = getFieldMapping().get(field);
            Specification<TEntity> spec = createEqualsSpecification(mappingField, value);

            return repository.findAll(spec, pageable).map(mapper::toDto);
        }
        catch (ConstraintViolationException ex){
            throw new SearchException("Invalid search query: " + ex.getMessage());
        }
    }

    public Page<TDto> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDto);
    }

    public TId create(TDto dto) {
        try {
            TEntity entity = mapper.toEntity(dto);
            entity.setId(null);
            entity = repository.save(entity);
            notificationService.sendAddNotification(
                    entity.getStringId(),
                    getEntityName(),
                    false);
            return entity.getId();
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            log.atWarn().setMessage(e.getMessage()).log();
            throw new IllegalArgumentException("incorrect value/values");
        }
    }

    public void update(TDto dto) {
        try {
            TEntity entity = mapper.toEntity(dto);
            checkIdExists(entity.getId());
            notificationService.sendUpdateNotification(
                    repository.save(entity).getStringId(),
                    getEntityName(),
                    false);
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            throw new IllegalArgumentException("incorrect value/values");
        }
    }

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

    private void validateSearchFields(String field) {
        if (!(getFieldMapping().containsKey(field) &&
                getAllowedSearchFields().contains(getFieldMapping().get(field)))) {
            throw new IllegalArgumentException("Invalid search field: " + field);
        }
    }

    private Specification<TEntity> createEqualsSpecification(String field, String value) {
        return (root, _, criteriaBuilder) -> {
            if (value == null || value.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            try {
                return criteriaBuilder.equal(root.get(field), value);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Field '" + field + "' not found"); //ошибка настройки
            }
        };
    }

    protected Set<String> getAllowedSearchFields(){
        return Set.of();
    }

    protected Map<String, String> getFieldMapping(){
        return Map.of();
    }
}
