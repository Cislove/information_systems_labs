package se.ifmo.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import se.ifmo.common.placemark.AbstractRepository;

@Repository
public interface ProductRepository extends AbstractRepository<Product, Integer>,
        JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

}
