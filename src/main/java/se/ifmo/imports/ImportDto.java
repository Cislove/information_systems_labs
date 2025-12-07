package se.ifmo.imports;

import se.ifmo.common.placemark.Dto;

import java.util.List;

public record ImportDto(
        List<Dto> dtos
) {
}
