package se.ifmo.coordinates;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.ifmo.common.placemark.AbstractRepository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class CoordinatesRepository implements AbstractRepository<Coordinates, Integer>{
    private final static String TOTAL_SIZE_QUERY = "SELECT COUNT(cord.id) FROM Coordinates cord";
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    @Override
    public Optional<Coordinates> findById(Integer id){
        log.info("Find Coordinates by id: {}", id);
        Session session = entityManager.unwrap(Session.class);
        Coordinates res = session.get(Coordinates.class, id);
        return Optional.ofNullable(res);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Coordinates> findAll(Pageable pageable){
        log.info("Find all Coordinates pageable: {}", pageable);
        Session session = entityManager.unwrap(Session.class);
        session.getTransaction().begin();
        List<Coordinates> results = session.createQuery(
                "FROM Coordinates cord ORDER BY cord.id", Coordinates.class)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        Long total = session.createQuery(TOTAL_SIZE_QUERY, Long.class).getSingleResult();

        session.getTransaction().commit();

        return new PageImpl<>(results, pageable, total);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Coordinates> findAll(Specification<Coordinates> spec, Pageable pageable) {
        log.info("Find all Coordinates pageable: {}", pageable);
        Session session = entityManager.unwrap(Session.class);
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Coordinates> query = cb.createQuery(Coordinates.class);
        Root<Coordinates> root = query.from(Coordinates.class);

        Predicate predicate = spec.toPredicate(root, query, cb);
        query.where(predicate);

        List<Coordinates> results = session.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        Long total = session.createQuery(TOTAL_SIZE_QUERY, Long.class).getSingleResult();

        return new PageImpl<>(results, pageable, total);
    }

    @Transactional
    public Coordinates save(Coordinates coordinates){
        log.info("Save Coordinates: {}", coordinates);
        Session session = entityManager.unwrap(Session.class);
        if(coordinates.getId() == null){
            session.persist(coordinates);
            return coordinates;
        }
        return session.merge(coordinates);
    }

    @Transactional
    public void deleteById(Integer id){
        log.info("Delete Coordinates by id: {}", id);
        Session session = entityManager.unwrap(Session.class);
        session.remove(session.get(Coordinates.class, id));
    }

    public boolean existsById(Integer id){
        log.info("Exists Coordinates by id: {}", id);
        return findById(id).isPresent();
    }
}
