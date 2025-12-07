package se.ifmo.history;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImportHistoryMapper{
    ImportHistoryDto toDto(ImportHistory importHistory);
}
