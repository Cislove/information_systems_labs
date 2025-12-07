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
public class LocationOrganizationCsv {
    @CsvBindByName(column = "manufacturer.officialAddress.town.id")
    private Integer id;
    @CsvBindByName(column = "manufacturer.officialAddress.town.x")
    private float x;
    @CsvBindByName(column = "manufacturer.officialAddress.town.y")
    private Long y;
    @CsvBindByName(column = "manufacturer.officialAddress.town.z")
    private Long z;

    public static LocationOrganizationCsv fromDto(LocationDto dto) {
        return new LocationOrganizationCsv(
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
