package se.ifmo.coordinates;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CoordinatesCsv {
    @CsvBindByName(column = "coordinates.id")
    private Integer id;
    @CsvBindByName(column = "coordinates.x")
    private double x;
    @CsvBindByName(column = "coordinates.y")
    private float y;

    public static CoordinatesCsv fromDto(CoordinatesDto dto) {
        return new CoordinatesCsv(
                dto.id(),
                dto.x(),
                dto.y()
        );
    }
    public CoordinatesDto toDto() {
        return new CoordinatesDto(
                this.id,
                this.x,
                this.y
        );
    }
}
