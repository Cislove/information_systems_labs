package se.ifmo.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import se.ifmo.common.placemark.AbstractRepository;

@Repository
public interface OrganizationRepository extends AbstractRepository<Organization, Integer>,
        JpaRepository<Organization, Integer>, JpaSpecificationExecutor<Organization> {

}
