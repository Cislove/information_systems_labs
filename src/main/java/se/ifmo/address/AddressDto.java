package se.ifmo.address;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;
import se.ifmo.location.LocationDto;

import java.io.Serializable;

@Schema(requiredProperties = {"id"})
public record AddressDto(
    int id,
    String street,
    String zipCode,
    LocationDto town
) implements Dto {
}
