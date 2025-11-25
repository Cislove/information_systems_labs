package se.ifmo.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import se.ifmo.common.placemark.AbstractRepository;

@Repository
public interface LocationRepository extends AbstractRepository<Location, Integer>,
        JpaRepository<Location, Integer>, JpaSpecificationExecutor<Location> {
}
