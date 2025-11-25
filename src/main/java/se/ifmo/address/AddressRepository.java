package se.ifmo.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import se.ifmo.common.placemark.AbstractRepository;

@Repository
public interface AddressRepository extends AbstractRepository<Address, Integer>,
        JpaRepository<Address, Integer>, JpaSpecificationExecutor<Address> {
}
