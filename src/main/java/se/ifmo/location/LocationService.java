package se.ifmo.location;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import se.ifmo.common.AbstractCrudService;

@Service
public class LocationService extends AbstractCrudService<
        Location,
        LocationRepository,
        LocationDto,
        LocationMapper,
        Integer
        >{

    public LocationService(LocationRepository repository, @Qualifier("locationMapperImpl") LocationMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public String getEntityName() {
        return "location";
    }

    @Override
    protected Class<LocationDto> getDtoClass() {
        return LocationDto.class;
    }
}
