package se.ifmo.location;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocationPersonCsv {
    private Integer id;
    @CsvBindByName(column = "owner.location.x")
    private float x;
    @CsvBindByName(column = "owner.location.y")
    private Long y;
    @CsvBindByName(column = "owner.location.z")
    private Long z;

    public static LocationPersonCsv fromDto(LocationDto dto) {
        return new LocationPersonCsv(
                dto.id(),
                dto.x(),
                dto.y(),
                dto.z()
        );
    }
    public LocationDto toDto() {
        return new LocationDto(
                id,
                x,
                y,
                z
        );
    }
}
