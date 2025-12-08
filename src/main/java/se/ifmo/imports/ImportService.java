package se.ifmo.imports;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import se.ifmo.history.ImportHistory;
import se.ifmo.history.ImportHistoryService;
import se.ifmo.imports.parser.FileParser;
import se.ifmo.notification.NotificationService;
import se.ifmo.organization.Organization;
import se.ifmo.organization.OrganizationService;
import se.ifmo.product.ProductDto;
import se.ifmo.product.ProductMapper;
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
    private final NotificationService notificationService;
    private final ProductMapper productMapper;
    private final OrganizationService organizationService;
    private final PlatformTransactionManager txManager;

    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

//    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = IllegalArgumentException.class)
    public void importFile(MultipartFile file){
        int importHistoryId = importHistoryService.addImport(file.getOriginalFilename()).getId();

        for(FileParser fileParser : parsers){
            if(fileParser.supportsFormat(file.getOriginalFilename(), file.getContentType())){
                executeParsing(fileParser, file, importHistoryId);
                return;
            }
        }
        throw new ImportException("File not supported");
    }

    private void executeParsing(FileParser parser, MultipartFile file, int importHistoryId){
        UUID documentId = UUID.randomUUID();

        try{
            var input = parser.parse(file.getInputStream()).toList();
            input.forEach(product -> {
                if(product.coordinates().y() <= -718){
                    throw new IllegalArgumentException("Invalid coordinates: Y must be greater than -718");
                }
            });

            openSearchService.index(input, documentId);
            notificationService.sendAddNotification(null, null, true);

            executor.submit(() -> {
                DefaultTransactionDefinition def = new DefaultTransactionDefinition();
                def.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);
                def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
                TransactionStatus status = txManager.getTransaction(def);
                try {
                    postParseTask(documentId, input);
                    importHistoryService.makeImportCompleted(importHistoryId, input.size());
                    txManager.commit(status);
                } catch (Exception e) {
                    openSearchService.refresh();
                    txManager.rollback(status);
                    importHistoryService.makeImportFailed(importHistoryId);
                    openSearchService.deleteByDocumentId(documentId);
                    System.out.println("import failed");
                }
                notificationService.sendAddNotification(null, null, true);
            });
        }
        catch (Exception e){
            openSearchService.deleteByDocumentId(documentId);
            importHistoryService.makeImportFailed(importHistoryId);
            notificationService.sendAddNotification(null, null, true);
            throw new IllegalArgumentException("Failed to read file");
        }
    }

    private void postParseTask(UUID documentId, List<ProductDto> dtosForDb) throws InterruptedException {
        scheduleCleanup(documentId, Duration.ofMinutes(10));
        final int[] counter = {0};
        Thread.sleep(Duration.ofSeconds(20));
        for(ProductDto productDto : dtosForDb){
            productService.save(productMapper.toEntity(productDto));
            openSearchService.deleteByDocumentIdAndObjectId(documentId, counter[0]++);
        }
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
