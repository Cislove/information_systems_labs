package se.ifmo.history;

import java.time.Instant;
import java.util.UUID;

public record ImportHistoryDto(
        int id,
        Instant importTime,
        String fileName,
        ImportHistory.ImportStatus status,
        int addedNumberOfObjects
) {
}
