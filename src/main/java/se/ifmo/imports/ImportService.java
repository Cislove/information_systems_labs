package se.ifmo.imports;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import se.ifmo.history.ImportHistory;
import se.ifmo.history.ImportHistoryService;
import se.ifmo.imports.parser.FileParser;
import se.ifmo.product.ProductDto;
import se.ifmo.product.ProductService;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Setter
@Getter
public class ImportService {
    @Lazy
    private final ProductService productService;
    private final ImportHistoryService importHistoryService;
    private final OpenSearchService openSearchService;
    private final List<FileParser> parsers;

    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = IllegalArgumentException.class)
    public void importFile(MultipartFile file){
        int importHistoryId = importHistoryService.addImport(file.getOriginalFilename()).getId();

        for(FileParser fileParser : parsers){
            if(fileParser.supportsFormat(file.getOriginalFilename(), file.getContentType())){
                executeParsing(fileParser, file, importHistoryId);
                return;
            }
        }
        importHistoryService.makeImportFailed(importHistoryId);
        throw new ImportException("File not supported");
    }

    private void executeParsing(FileParser parser, MultipartFile file, int importHistoryId){
        String fileName = file.getOriginalFilename();
        String type = file.getContentType();

        if(parser.supportsFormat(fileName, type)){
            UUID documentId = UUID.randomUUID();
            final int[] objectId = {0};
            List<ProductDto> dtosForDb = new ArrayList<>();
            List<Future<Void>> indexingTasks = new ArrayList<>();

            try{
                var inputStream = parser.parse(file.getInputStream());
                inputStream.forEach(productDto -> executeDto(objectId, documentId, productDto, dtosForDb, indexingTasks));
            }
            catch (IOException e){
                openSearchService.deleteByDocumentId(documentId);
                throw new IllegalArgumentException("Failed to read file");
            }

            executor.submit(() -> {
                try {
                    postParseTask(indexingTasks, documentId, dtosForDb);
                    importHistoryService.makeImportCompleted(importHistoryId, dtosForDb.size());
                    return null;
                }
                catch (Exception e){
                    openSearchService.deleteByDocumentId(documentId);
                    importHistoryService.makeImportFailed(importHistoryId);
                    throw e;
                }
            });
        }
    }

    private void postParseTask(List<Future<Void>> indexingTasks, UUID documentId, List<ProductDto> dtosForDb){
        waitIndexing(indexingTasks);
        scheduleCleanup(documentId, Duration.ofMinutes(10));
        final int[] counter = {0};
        dtosForDb.forEach(productDto -> {
            productService.create(productDto);
            openSearchService.deleteByDocumentIdAndObjectId(documentId, counter[0]++);
        });
    }

    private void waitIndexing(List<Future<Void>> tasks){
        tasks.forEach(task -> {
            try {
                task.get();
            } catch (InterruptedException | ExecutionException e) {
                throw new ImportException("Import interrupted");
            }
        });
    }

    private void executeDto(
        final int[] objectId,
        UUID documentId,
        ProductDto dto,
        List<ProductDto> dtosForDb,
        List<Future<Void>> indexingTasks){

        int currentObjectId = objectId[0]++;
        dtosForDb.add(dto);
        indexingTasks.add(executor.submit(() -> {
            openSearchService.index(dto, documentId, currentObjectId);
            return null;
        }));
    }

    private void scheduleCleanup(UUID documentId, Duration delay){
        scheduler.schedule(() -> {
            try{
                openSearchService.deleteByDocumentId(documentId);
            }
            catch (Exception e){
                throw new ImportException("Failed to schedule cleanup");
            }
        }, delay.toMillis(), TimeUnit.MILLISECONDS);
    }
}
