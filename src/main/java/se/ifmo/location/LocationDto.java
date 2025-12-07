package se.ifmo.location;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;

@Schema(requiredProperties = {"id"})
public record LocationDto(
        Integer id,
        float x,
        Long y,
        Long z
) implements Dto {
    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "location";
    }

}
