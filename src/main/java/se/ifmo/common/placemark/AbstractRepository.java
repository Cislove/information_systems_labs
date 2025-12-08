package se.ifmo.common.placemark;

import jakarta.persistence.QueryHint;
import jakarta.persistence.Temporal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.NoRepositoryBean;
import se.ifmo.coordinates.Coordinates;

import java.util.Optional;

@NoRepositoryBean
public interface AbstractRepository<TEntity, TId>{

    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
    Optional<TEntity> findById(TId id);

    Page<TEntity> findAll(Pageable pageable);

    Page<TEntity> findAll(Specification<TEntity> spec, Pageable pageable);

    <S extends TEntity> S save(S entity);

    void deleteById(TId id);

    boolean existsById(TId id);

    long count();
}
