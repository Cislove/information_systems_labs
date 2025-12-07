package se.ifmo.organization;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvRecurse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import se.ifmo.address.AddressCsv;
import se.ifmo.model.OrganizationType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationCsv {
    @CsvBindByName(column = "manufacturer.id")
    private Integer id;
    @CsvBindByName(column = "manufacturer.name")
    private String name;
    @CsvRecurse
    private AddressCsv officialAddress;
    @CsvBindByName(column = "manufacturer.annualTurnover")
    private int annualTurnover;
    @CsvBindByName(column = "manufacturer.employeesCount")
    private long employeesCount;
    @CsvBindByName(column = "manufacturer.fullName")
    private String fullName;
    @CsvBindByName(column = "manufacturer.rating")
    private int rating;
    @CsvBindByName(column = "manufacturer.type")
    private OrganizationType type;

    public static OrganizationCsv fromDto(OrganizationDto dto) {
        return new OrganizationCsv(
                dto.id(),
                dto.name(),
                AddressCsv.fromDto(dto.officialAddress()),
                dto.annualTurnover(),
                dto.employeesCount(),
                dto.fullName(),
                dto.rating(),
                dto.type()
        );
    }

    public OrganizationDto toDto() {
        return new OrganizationDto(
                id,
                name,
                officialAddress.toDto(),
                annualTurnover,
                employeesCount,
                fullName,
                rating,
                type
        );
    }
}
