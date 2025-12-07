package se.ifmo.imports;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.UUID;

@NoArgsConstructor
public class IndexDocument {
    @Id
    private String id;

    @Getter @Setter
    private UUID documentId;

    @Getter @Setter
    private Integer objectId;

    @Setter
    private JsonNode payload;

    public static IndexDocument of(UUID documentId, Integer objectId, JsonNode payload) {
        var doc = new IndexDocument();
        doc.setDocumentId(documentId);
        doc.setObjectId(objectId);
        doc.setPayload(payload);
        doc.setId(documentId, objectId);

        return doc;
    }

    public String getId() {
        return String.format("%s:%s", this.documentId, this.objectId);
    }

    public void setId(UUID documentId, Integer objectId) {
        this.id = String.format("%s:%s", documentId, objectId);
        this.documentId = documentId;
        this.objectId = objectId;
    }

    public JsonNode getPayload() {
        return payload;
    }
}