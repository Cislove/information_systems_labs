package se.ifmo.history;

import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportHistoryService {
    private final ImportHistoryRepository importHistoryRepository;

    @Transactional
    public ImportHistory addImport(String fileName) {
        var importHistory = ImportHistory.builder()
                .fileName(fileName)
                .importTime(Instant.now())
                .build();

        return importHistoryRepository.save(importHistory);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void makeImportCompleted(int id, int addedNumberOfObjects) {
        var importHistory = importHistoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Import history not found with id: " + id));

        importHistory.setStatus(ImportHistory.ImportStatus.COMPLETED);
        importHistory.setAddedNumberOfObjects(addedNumberOfObjects);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void makeImportFailed(int id) {
        var importHistory = importHistoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Import history not found with id: " + id));

        importHistory.setStatus(ImportHistory.ImportStatus.FAILED);
    }


    @Transactional(readOnly = true)
    public List<ImportHistory> getLastNImportHistories(int n) {
        if(n > 20){
            throw new IllegalArgumentException("Cannot fetch more than 20 import histories");
        }

        return importHistoryRepository
            .getLastImports(n);
    }

    @Transactional(readOnly = true)
    public Page<ImportHistory> getAll(Pageable pageable) {
        return importHistoryRepository.findAll(pageable);
    }
}
