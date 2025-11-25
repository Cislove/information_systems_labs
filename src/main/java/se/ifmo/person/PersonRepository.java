package se.ifmo.person;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import se.ifmo.common.placemark.AbstractRepository;

@Repository
public interface PersonRepository extends AbstractRepository<Person, Integer>,
        JpaRepository<Person, Integer>, JpaSpecificationExecutor<Person> {
}
