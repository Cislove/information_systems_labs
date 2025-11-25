package se.ifmo.product;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import se.ifmo.common.placemark.Dto;
import se.ifmo.coordinates.Coordinates;
import se.ifmo.coordinates.CoordinatesDto;
import se.ifmo.model.UnitOfMeasure;
import se.ifmo.organization.OrganizationDto;
import se.ifmo.person.PersonDto;

import java.util.Date;

@Schema(requiredProperties = {"id"})
public record ProductDto(
    @NotNull int id,
    String name,
    CoordinatesDto coordinates,
    Date creationDate,
    UnitOfMeasure unitOfMeasure,
    OrganizationDto manufacturer,
    double price,
    int manufactureCost,
    float rating,
    String partNumber,
    PersonDto owner
) implements Dto{
}
