package se.ifmo.product;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import se.ifmo.common.AbstractCrudService;
import se.ifmo.imports.ImportService;

import java.util.Map;
import java.util.Set;

@Service
public class ProductService extends AbstractCrudService<
        Product,
        ProductRepository,
        ProductDto,
        ProductMapper,
        Integer
        > {

    public ProductService(ProductRepository repository, @Qualifier("productMapperImpl") ProductMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public String getEntityName() {
        return "product";
    }

    @Override
    protected Map<String, String> getAllowedSearchFieldsWithLabels() {
        return Map.of(
                "name", "название",
                "part_number", "серийный номер");
    }

    @Override
    protected Set<String> getAllowedSearchFields() {
        return Set.of("name", "coordinates.id", "manufacturer.id", "price", "manufactureCost", "rating", "partNumber", "owner.id");
    }

    @Override
    protected Map<String, String> getFieldMapping() {
        return Map.of(
                "name", "name",
                "coordinates", "coordinates.id",
                "manufacturer", "manufacturer.id",
                "price", "price",
                "manufactureCost", "manufactureCost",
                "rating", "rating",
                "partNumber", "partNumber",
                "owner", "owner.id");
    }

    @Override
    protected Class<ProductDto> getDtoClass() {
        return ProductDto.class;
    }

}
