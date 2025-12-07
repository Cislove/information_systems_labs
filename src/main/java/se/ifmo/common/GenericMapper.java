package se.ifmo.common;

import se.ifmo.common.placemark.Dto;

public interface GenericMapper<D extends Dto, E extends AbstractEntity<?>> {
    D toDto(E entity);
    E toEntity(D dto);

    default Integer map(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer i) {
            return i;
        }
        if(value instanceof Number n){
            return n.intValue();
        }
        return Integer.valueOf(value.toString());
    }
}
