package se.ifmo.imports;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Index;
import lombok.RequiredArgsConstructor;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._types.Refresh;
import org.opensearch.client.opensearch._types.query_dsl.BoolQuery;
import org.opensearch.client.opensearch._types.query_dsl.Query;
import org.opensearch.client.opensearch.core.DeleteByQueryRequest;
import org.opensearch.client.opensearch.core.IndexRequest;
import org.opensearch.client.opensearch.core.SearchRequest;
import org.opensearch.client.opensearch.core.SearchResponse;
import org.opensearch.client.util.ObjectBuilder;
import org.springframework.stereotype.Service;
import se.ifmo.common.placemark.Dto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
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

    public <T extends Dto> void index(T dto, UUID documentId, Integer objectId) {
        try {
            IndexDocument doc = IndexDocument.of(documentId, objectId, objectMapper.valueToTree(dto));
            IndexRequest<IndexDocument> req = IndexRequest.of(b -> b
                .index(dto.getIndexName())
                .id(doc.getId())
                .document(doc)
                .refresh(Refresh.WaitFor)
            );
            client.index(req);

            if(dto instanceof NestedProvider np) {
                for (var child: np.nested()){
                    if(child != null) {
                        index(child, documentId, objectId);
                    }
                }
            }

        } catch (Exception e) {
            throw new ImportException("Failed load dto to OpenSearch");
        }
    }

    public void deleteByDocumentIdAndObjectId(UUID documentId, Integer objectId) {
        try {
            indexesList.forEach(index -> {
                DeleteByQueryRequest req = DeleteByQueryRequest.of(b -> b
                        .index(index)
                        .query(q ->
                                q.term(t -> t
                                .field("id.keyword")
                                .value(v -> v.stringValue(documentId.toString() + ":" + objectId.toString()))))
                        .refresh(true));
                try {
                    client.deleteByQuery(req);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed update dto in OpenSearch");
        }
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
                    throw new RuntimeException(e);
                }
            });
        } catch (Exception e) {
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
        );
        try {
            SearchResponse<IndexDocument> resp = client.search(searchRequest, IndexDocument.class);
            List<IndexDocument> result = new ArrayList<>();
            resp.hits().hits().forEach(hit -> {
                IndexDocument src = hit.source();
                if(src != null) {
                    result.add(src);
                }
            });
            return result;

        } catch (Exception e) {
            throw new ImportException("Failed search dto in OpenSearch");
        }
    }

//    private <T extends Dto> List<IndexDocument<T>> extractPayloads(SearchResponse<IndexDocument> searchResponse, Class<T> dtoClass) {
//        List<IndexDocument<T>> results = new ArrayList<>();
//        searchResponse.hits().hits().forEach(hit -> {
//            IndexDocument<?> doc = hit.source();
//            if (doc != null && doc.getPayload() != null) {
//                T payload = objectMapper.convertValue(doc.getPayload(), dtoClass);
//                results.add(IndexDocument.of(doc.getDocumentId(), doc.getObjectId(), payload));
//            }
//        });
//        return results;
//    }

    private Function<Query.Builder, ObjectBuilder<Query>> buildQueryFunction(Map<String, String> fieldAndValue) {
        List<Query> queries = new ArrayList<>();
        fieldAndValue.forEach((field, value) -> {
            Query termQuery = Query.of(q -> q.term(t -> t.field("payload." + field).value(v -> v.stringValue(value))));
            queries.add(termQuery);
        });
        BoolQuery boolQuery = BoolQuery.of(b -> b.must(queries));
        return q -> q.bool(boolQuery);
    }
}