package se.ifmo.organization;

import io.swagger.v3.oas.annotations.media.Schema;
import se.ifmo.address.AddressDto;
import se.ifmo.common.placemark.Dto;
import se.ifmo.model.OrganizationType;

@Schema(requiredProperties = {"id"})
public record OrganizationDto(
        int id,
        String name,
        AddressDto officialAddress,
        int annualTurnover,
        long employeesCount,
        String fullName,
        int rating,
        OrganizationType type
) implements Dto {
}
