package se.ifmo.organization;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import se.ifmo.common.AbstractCrudService;

import java.util.Map;
import java.util.Set;

@Service
public class OrganizationService extends AbstractCrudService<
        Organization,
        OrganizationRepository,
        OrganizationDto,
        OrganizationMapper,
        Integer
        >{

    public OrganizationService(OrganizationRepository repository, @Qualifier("organizationMapperImpl") OrganizationMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public String getEntityName() {
        return "organization";
    }

    @Override
    protected Map<String, String> getAllowedSearchFieldsWithLabels() {
        return Map.of(
                "name", "название",
                "full_name", "полное название"
        );
    }

    @Override
    protected Set<String> getAllowedSearchFields() {
        return Set.of("name", "officialAddress.id", "annualTurnover", "employeesCount", "fullName", "rating");
    }

    @Override
    protected Map<String, String> getFieldMapping() {
        return Map.of("name", "name",
                "officialAddress", "officialAddress.id",
                "annualTurnover", "annualTurnover",
                "employeesCount", "employeesCount",
                "fullName", "fullName",
                "rating", "rating");
    }
}
