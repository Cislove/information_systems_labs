package se.ifmo.coordinates;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import se.ifmo.common.AbstractCrudService;

import javax.swing.text.html.parser.Entity;

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

    @Override
    public Integer save(Coordinates entity) {
        if (!isValid(entity)) {
            throw new IllegalArgumentException("Invalid coordinates: Y must be greater than -718");
        }
        return super.save(entity);
    }

    public boolean isValid(Coordinates entity){
        return entity.getY() > -718;
    }
}
