package se.ifmo.coordinates;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import se.ifmo.common.AbstractCrudService;

@Service
public class CoordinatesService extends AbstractCrudService<
        Coordinates,
        CoordinatesRepository,
        CoordinatesDto,
        CoordinatesMapper,
        Integer
        > {


    public CoordinatesService(CoordinatesRepository repository, @Qualifier("coordinatesMapperImpl") CoordinatesMapper mapper) {

        super(repository, mapper);
    }

    @Override
    public String getEntityName() {
        return "coordinates";
    }

    @Override
    protected Class<CoordinatesDto> getDtoClass() {
        return CoordinatesDto.class;
    }
}
