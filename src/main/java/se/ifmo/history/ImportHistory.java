package se.ifmo.history;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

    @Entity
    @Getter @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class ImportHistory {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;
        private Instant importTime;
        private String fileName;
        @Enumerated(EnumType.STRING)
        private ImportStatus status;
        private int addedNumberOfObjects;

        public enum ImportStatus {
            IN_PROGRESS,
            COMPLETED,
            FAILED
        }
}
