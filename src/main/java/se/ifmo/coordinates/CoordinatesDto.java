package se.ifmo.coordinates;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;

@Schema(requiredProperties = {"id"})
public record CoordinatesDto(
        Integer id,
        double x,
        float y
) implements Dto {

    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "coordinates";
    }

}
