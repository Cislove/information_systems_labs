package se.ifmo.location;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;

@Schema(requiredProperties = {"id"})
public record LocationDto(
        int id,
        float x,
        long y,
        long z
) implements Dto {
}
