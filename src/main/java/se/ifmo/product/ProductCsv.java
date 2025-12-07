package se.ifmo.product;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvDate;
import com.opencsv.bean.CsvRecurse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import se.ifmo.coordinates.CoordinatesCsv;
import se.ifmo.coordinates.CoordinatesDto;
import se.ifmo.model.UnitOfMeasure;
import se.ifmo.organization.OrganizationCsv;
import se.ifmo.organization.OrganizationDto;
import se.ifmo.person.PersonCsv;
import se.ifmo.person.PersonDto;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCsv {
    @CsvBindByName(column = "id")
    private Integer id;
    @CsvBindByName(column = "name")
    private String name;
    @CsvRecurse
    private CoordinatesCsv coordinates;

    @CsvBindByName(column = "creationDate")
    @CsvDate("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private Date creationDate;

    @CsvBindByName(column = "unitOfMeasure")
    private UnitOfMeasure unitOfMeasure;
    @CsvRecurse
    private OrganizationCsv manufacturer;
    @CsvBindByName(column = "price")
    private Double price;
    @CsvBindByName(column = "manufactureCost")
    private int manufactureCost;
    @CsvBindByName(column = "rating")
    private Float rating;
    @CsvBindByName(column = "partNumber")
    private String partNumber;
    @CsvRecurse
    private PersonCsv owner;

    public static ProductCsv fromDto(ProductDto dto) {
        return new ProductCsv(
                dto.id(),
                dto.name(),
                CoordinatesCsv.fromDto(dto.coordinates()),
                dto.creationDate(),
                dto.unitOfMeasure(),
                OrganizationCsv.fromDto(dto.manufacturer()),
                dto.price(),
                dto.manufactureCost(),
                dto.rating(),
                dto.partNumber(),
                PersonCsv.fromDto(dto.owner())
        );
    }

    public ProductDto toDto() {
        return new ProductDto(
                id,
                name,
                coordinates.toDto(),
                creationDate,
                unitOfMeasure,
                manufacturer.toDto(),
                price,
                manufactureCost,
                rating,
                partNumber,
                owner.toDto()
        );
    }
}
