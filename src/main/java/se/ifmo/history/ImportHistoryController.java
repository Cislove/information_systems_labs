package se.ifmo.history;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.ifmo.common.PageDto;

import java.util.List;

@RestController
@RequestMapping("api/import/history")
@RequiredArgsConstructor
public class ImportHistoryController {
    private final ImportHistoryService service;
    private final ImportHistoryMapper mapper;

    @Operation(summary = "Получить {limit} последних записей истории импортов, максимум 20")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно получено")
    })
    @GetMapping(params = "limit")
    public List<ImportHistoryDto> getImportHistory(@RequestParam int limit) {
        return service.getLastNImportHistories(limit).stream()
                .map(mapper::toDto)
                .toList();
    }

    @Operation(summary = "Получить страницу истории импортов")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно получено")
    })
    @GetMapping(params = {"pageNumber", "size"})
    public PageDto<ImportHistoryDto> getImportHistoryPage(
            @Parameter(description = "Номер страницы") @RequestParam(defaultValue = "0") int pageNumber,
            @Parameter(description = "Размер страницы") @RequestParam(defaultValue = "10") int size) {
        return mapToPageDto(service.getAll(PageRequest.of(pageNumber, size)));
    }

    private PageDto<ImportHistoryDto> mapToPageDto(Page<ImportHistory> page) {
        return new PageDto<>(
            page.getContent().stream().map(mapper::toDto).toList(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements()
        );
    }
}


