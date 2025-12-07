package se.ifmo.organization;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.address.AddressDto;
import se.ifmo.common.placemark.Dto;
import se.ifmo.imports.NestedProvider;
import se.ifmo.model.OrganizationType;

import java.util.List;

@Schema(requiredProperties = {"id"})
public record OrganizationDto(
        Integer id,
        String name,
        AddressDto officialAddress,
        int annualTurnover,
        long employeesCount,
        String fullName,
        int rating,
        OrganizationType type
) implements Dto, NestedProvider {
    @Schema(hidden = true)
    @Override
    public String getIndexName() {
        return "organization";
    }

    @Schema(hidden = true)
    @Override
    public List<Dto> nested() {
        return List.of(officialAddress);
    }
}
