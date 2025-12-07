package se.ifmo.location;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationCsv {
    private Integer id;
    private float x;
    private Long y;
    private Long z;

    public static LocationCsv fromDto(LocationDto dto) {
        return new LocationCsv(
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
