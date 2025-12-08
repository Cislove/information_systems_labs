package se.ifmo.operations;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.ifmo.model.UnitOfMeasure;
import se.ifmo.operations.dto.PriceReduceDto;
import se.ifmo.product.Product;
import se.ifmo.product.ProductDto;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/product")
@RequiredArgsConstructor
public class ProductOperationsController {
    private final ProductOperationsService productOperationsService;

    @GetMapping("/rating/sum")
    public double getRatingSum() {
        return productOperationsService.getSumRatingOfProduct();
    }

    @GetMapping("/rating/countOfGroups")
    public Map<Double, Long> getRatingCountOfGroups() {
        return productOperationsService.groupByRating();
    }

    @GetMapping("/rating/countOfProductWhereRatingGreaterThan/{rating}")
    public long getRatingCountOfProductWhereRatingGreaterThat(
            @PathVariable float rating) {

        return productOperationsService.countOfProductsWhereRatingGreaterThan(rating);
    }

    @PostMapping("/unitOfMeasure/productWhereUnitOfMeasureIsSet")
    public List<ProductDto> getUnitOfMeasureProductWhereUnitOfMeasureIsSet(
            @RequestBody List<UnitOfMeasure> unitOfMeasures) {

        return productOperationsService.filterByUnitOfMeasure(unitOfMeasures);
    }

    @PostMapping("/price/reduce")
    public void reducePrice(@Valid @RequestBody PriceReduceDto priceReduceDto) {
        productOperationsService.priceReduce(priceReduceDto.percent());
    }

}
