package se.ifmo.common;


import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.ifmo.common.placemark.Dto;


@RequiredArgsConstructor
public abstract class AbstractCrudController<
        TDto extends Dto,
        TId extends Number,
        TService extends AbstractCrudService<?, ?, TDto, ?, TId>
        > {

    private final TService service;

    @GetMapping
    @Operation(summary = "Получить страницу объектов")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно получено"),
    })
    public PageDto<TDto> getAll(
            @Parameter(description = "Номер страницы") @RequestParam(defaultValue = "0") int pageNumber,
            @Parameter(description = "Размер страницы") @RequestParam(defaultValue = "10") int size) {

        return mapToPageDto(service.getAll(PageRequest.of(pageNumber, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить объект по id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно получено"),
    })
    public TDto getById(@PathVariable TId id) {
        return service.getById(id);
    }

    @PostMapping
    @Operation(summary = "Создать объект и получить в ответ его ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно создано"),
    })
    public ResponseEntity<TId> create(
            @Parameter(description = "объект") @RequestBody TDto dto) {
        return new ResponseEntity<>(service.create(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Получить страницу объектов с заданным значением поля")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно получено"),
    })
    @GetMapping("/search")
    public PageDto<TDto> search(
            @Parameter(description = "Имя поля") @RequestParam String field,
            @Parameter(description = "Значение поля") @RequestParam String value,
            @Parameter(description = "Номер страницы") @RequestParam(defaultValue = "0") int pageNumber,
            @Parameter(description = "Размер страницы") @RequestParam(defaultValue = "10") int size) {

        return mapToPageDto(service.searchByValueInField(field, value, PageRequest.of(pageNumber, size)));
    }

    @PutMapping
    @Operation(summary = "Обновить объект полностью, кроме его ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно обновлено"),
    })
    public void update(@RequestBody TDto dto) {
        service.update(dto);
    }

    @Operation(summary = "Удалить объект по ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно удален"),
    })
    @DeleteMapping("/{id}")
    public void delete(@PathVariable TId id) {
        service.delete(id);
    }


    private PageDto<TDto> mapToPageDto(Page<TDto> page) {
        return new PageDto<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }
}
