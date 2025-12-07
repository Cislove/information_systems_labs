package se.ifmo.imports;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public final class Metadata {
    private final Instant loadedAt;
    private final UUID documentId;
    private final Integer objectId;

    public static Metadata now(UUID documentId, Integer objectId) {
        return new Metadata(Instant.now(), documentId, objectId);
    }
}
