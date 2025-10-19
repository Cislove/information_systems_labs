package se.ifmo.operations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.ifmo.model.UnitOfMeasure;
import se.ifmo.notification.NotificationService;
import se.ifmo.product.Product;
import se.ifmo.product.ProductDto;
import se.ifmo.product.ProductMapper;
import se.ifmo.product.ProductRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductOperationsService {
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final ProductMapper productMapper;

    @Transactional
    public void priceReduce(double percent){
        productRepository.findAll()
                .forEach(product -> product.setPrice(product.getPrice() * (100 - percent) / 100));

        notificationService.sendUpdateNotification(null, "product", true);
    }

    @Transactional(readOnly = true)
    public double getSumRatingOfProduct(){
        return productRepository.findAll()
                .stream()
                .mapToDouble(Product::getRating).sum();
    }

    public long countOfProductsWhereRatingGreaterThan(double rating){
        return productRepository.findAll()
                .stream()
                .filter(product -> product.getRating() > rating)
                .count();
    }

    public Map<Double, Long> groupByRating(){
        return productRepository.findAll()
                .stream().collect(
                        Collectors.groupingBy(p -> Math.round(p.getRating() * 1000) / 10.0, Collectors.counting())
                );
    }

    public List<ProductDto> filterByUnitOfMeasure(List<UnitOfMeasure> unitOfMeasures){
        return productRepository.findAll()
                .stream()
                .filter(product -> unitOfMeasures.contains(product.getUnitOfMeasure()))
                .map(productMapper::toDto)
                .toList();
    }
}
