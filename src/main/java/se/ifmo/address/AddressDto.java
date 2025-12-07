package se.ifmo.address;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;
import se.ifmo.imports.NestedProvider;
import se.ifmo.location.LocationDto;

import java.util.List;

@Schema(requiredProperties = {"id"})
public record AddressDto(
    Integer id,
    String street,
    String zipCode,
    LocationDto town
) implements Dto, NestedProvider{
    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "address";
    }

    @Schema(hidden = true)
    @Override
    public List<Dto> nested() {
        return List.of(town);
    }

}
