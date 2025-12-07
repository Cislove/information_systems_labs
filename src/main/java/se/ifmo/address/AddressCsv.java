package se.ifmo.address;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvRecurse;
import lombok.*;
import se.ifmo.location.LocationCsv;
import se.ifmo.location.LocationDto;
import se.ifmo.location.LocationOrganizationCsv;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressCsv {
    @CsvBindByName(column = "manufacturer.officialAddress.id")
    private Integer id;
    @CsvBindByName(column = "manufacturer.officialAddress.street")
    private String street;
    @CsvBindByName(column = "manufacturer.officialAddress.zipCode")
    private String zipCode;
    @CsvRecurse
    private LocationOrganizationCsv town;

    public static AddressCsv fromDto(AddressDto dto) {
        return new AddressCsv(
                dto.id(),
                dto.street(),
                dto.zipCode(),
                LocationOrganizationCsv.fromDto(dto.town())
        );
    }

    public AddressDto toDto() {
        return new AddressDto(
               id,
               street,
               zipCode,
                town.toDto()
        );
    }
}
