package se.ifmo.imports;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._types.Refresh;
import org.opensearch.client.opensearch._types.query_dsl.Query;
import org.opensearch.client.opensearch.core.BulkRequest;
import org.opensearch.client.opensearch.core.DeleteByQueryRequest;
import org.opensearch.client.opensearch.core.SearchRequest;
import org.opensearch.client.opensearch.core.SearchResponse;
import org.opensearch.client.opensearch.core.bulk.BulkOperation;
import org.opensearch.client.opensearch.core.search.Hit;
import org.opensearch.client.util.ObjectBuilder;
import org.springframework.stereotype.Service;
import se.ifmo.common.placemark.Dto;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenSearchService {
    private final OpenSearchClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final List<String> indexesList = List.of(
        "product",
        "person",
        "organization",
        "address",
        "location",
        "coordinates"
    );

    public <T extends Dto> void index(List<T> dtos, UUID documentId) {
        if(dtos == null || dtos.isEmpty()) {
            return;
        }
        var documentsMap = collectDocuments(dtos, documentId);
        try {
            List<BulkOperation> operations = new ArrayList<>();

            documentsMap.forEach((index, documents) -> {
                for(int i = 0; i < dtos.size(); i++) {
                    IndexDocument doc = documents.get(i);
                    operations.add(BulkOperation.of(b -> b
                            .index(idx -> idx
                                    .index(index)
                                    .id(doc.getId())
                                    .document(doc))
                    ));
                }
            });

            BulkRequest request = BulkRequest.of(b -> b
                    .operations(operations)
                    .refresh(Refresh.WaitFor)
            );

            client.bulk(request);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            log.info(e.getMessage());
            throw new ImportException("Failed load dto to OpenSearch");
        }
    }

    private <T extends Dto> Map<String, List<IndexDocument>> collectDocuments(
            List<T> dtos, UUID documentId
    ) {
        Map<String, List<IndexDocument>> result = new HashMap<>();
        List<IndexDocument> docs = new ArrayList<>();

        for(int i = 0; i < dtos.size(); i++) {
            T dto = dtos.get(i);
            IndexDocument doc = IndexDocument.of(documentId, i, objectMapper.valueToTree(dto));
            docs.add(doc);
        }

        if(dtos.getFirst() instanceof NestedProvider np) {
            for(int i = 0; i < np.nested().size(); i++) {
                final int nestedIdx = i;
                var childs = dtos.stream()
                        .map(d -> {
                            var n = ((NestedProvider) d).nested();
                            return n.get(nestedIdx);
                        })
                        .toList();
                result.putAll(collectDocuments(childs, documentId));
            }
        }

        result.put(dtos.getFirst().getIndexName(), docs);
        return result;
    }

    public void deleteByDocumentIdAndObjectId(UUID documentId, Integer objectId) {
        try {
            indexesList.forEach(index -> {
                DeleteByQueryRequest req = DeleteByQueryRequest.of(b -> b
                        .index(index)
                        .query(q ->
                                q.term(t -> t
                                .field("id.keyword")
                                .value(v -> v.stringValue(documentId.toString() + ":" + objectId.toString())))));
                try {
                    client.deleteByQuery(req);
                } catch (IOException e) {
                    System.out.println(e.getMessage());
                    throw new RuntimeException(e);
                }
            });
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new IllegalArgumentException("Failed update dto in OpenSearch");
        }
    }

    public void refresh(){
        indexesList.forEach(index -> {
            try {
                client.indices().refresh(r -> r.index(index));
            } catch (IOException e) {
                System.out.println(e.getMessage());
                throw new RuntimeException(e);
            }
        });
    }

    public void deleteByDocumentId(UUID documentId) {
        try {
            indexesList.forEach(index -> {
                DeleteByQueryRequest req = DeleteByQueryRequest.of(b -> b
                        .index(index)
                        .query(q ->
                                q.term(t -> t
                                        .field("documentId.keyword")
                                        .value(v -> v.stringValue(documentId.toString()))))
                        .refresh(true));
                try {
                    client.deleteByQuery(req);
                }
                catch (IOException e) {
                    System.out.println(e.getMessage());
                    throw new RuntimeException(e);
                }
            });
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new IllegalArgumentException("Failed delete dto in OpenSearch");
        }
    }

    public List<IndexDocument> searchByExactMatch(
        String indexName,
        Map<String, String> fieldAndValue
    ) {
        SearchRequest searchRequest = SearchRequest.of(s -> s
            .index(indexName)
            .query(buildQueryFunction(fieldAndValue))
            .size(10000)
        );
        try {
            SearchResponse<IndexDocument> resp = client.search(searchRequest, IndexDocument.class);
            return resp.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .toList();

        } catch (Exception e) {
            throw new ImportException("Failed search dto in OpenSearch");
        }
    }

    private Function<Query.Builder, ObjectBuilder<Query>> buildQueryFunction(Map<String, String> fieldAndValue) {
        List<Query> queries = fieldAndValue.entrySet().stream()
                .map(entry -> {
                    String field = "payload." + entry.getKey();
                    String value = entry.getValue();

                    return Query.of(q -> q.term(t -> {
                        t.field(field);
                        if (isNumeric(value)) {
                            return t.value(v -> v.longValue(Integer.parseInt(value)));
                        } else {
                            return t.field(field + ".keyword")
                                    .value(v -> v.stringValue(value));
                        }
                    }));
                })
                .toList();
        return q -> q.bool(b -> b.must(queries));
    }

    private boolean isNumeric(String str) {
        if (str == null) {
            return false;
        }
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}