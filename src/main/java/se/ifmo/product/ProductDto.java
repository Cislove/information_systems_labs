package se.ifmo.product;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import se.ifmo.common.placemark.Dto;
import se.ifmo.coordinates.Coordinates;
import se.ifmo.coordinates.CoordinatesDto;
import se.ifmo.imports.NestedProvider;
import se.ifmo.model.UnitOfMeasure;
import se.ifmo.organization.OrganizationDto;
import se.ifmo.person.PersonDto;

import java.util.Date;
import java.util.List;

@Schema(requiredProperties = {"id"})
public record ProductDto (
    Integer id,
    String name,
    CoordinatesDto coordinates,
    Date creationDate,
    UnitOfMeasure unitOfMeasure,
    OrganizationDto manufacturer,
    Double price,
    int manufactureCost,
    Float rating,
    String partNumber,
    PersonDto owner
) implements Dto, NestedProvider {
    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "product";
    }

    @Schema(hidden = true)
    @Override
    public List<Dto> nested() {
        return List.of(coordinates, manufacturer, owner);
    }
}
