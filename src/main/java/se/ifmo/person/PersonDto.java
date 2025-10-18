package se.ifmo.person;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.common.placemark.Dto;
import se.ifmo.location.LocationDto;
import se.ifmo.model.Color;
import se.ifmo.model.Country;

import java.util.Date;

@Schema(description = "Person DTO")
public record PersonDto(
    int id,
    String name,
    Color eyeColor,
    Color hairColor,
    LocationDto location,
    Date birthday,
    Country nationality
) implements Dto {
}
