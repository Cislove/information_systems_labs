package se.ifmo.person;

import com.opencsv.bean.CsvBindByName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import se.ifmo.common.placemark.Dto;
import se.ifmo.imports.NestedProvider;
import se.ifmo.location.LocationDto;
import se.ifmo.model.Color;
import se.ifmo.model.Country;

import java.util.Date;
import java.util.List;

@Schema(description = "Person DTO", requiredProperties = {"id"})
public record PersonDto(
    Integer id,
    String name,
    Color eyeColor,
    Color hairColor,
    LocationDto location,
    Date birthday,
    Country nationality
) implements Dto, NestedProvider{
    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "person";
    }

    @Schema(hidden = true)
    @Override
    public List<Dto> nested() {
        return List.of(location);
    }
}
