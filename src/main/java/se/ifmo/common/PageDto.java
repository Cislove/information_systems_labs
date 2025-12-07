package se.ifmo.common;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;

import java.util.List;

public record PageDto <TDto extends Object>(
        List<TDto> content,
        int pageNumber,
        int pageSize,
        long totalSize

) implements Dto {

    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "";
    }
}
