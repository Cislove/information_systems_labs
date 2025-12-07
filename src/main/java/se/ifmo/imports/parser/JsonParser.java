package se.ifmo.imports.parser;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import org.springframework.stereotype.Component;
import se.ifmo.imports.ImportException;
import se.ifmo.product.ProductDto;

import java.io.IOException;
import java.io.InputStream;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Component
public class JsonParser implements FileParser{
    private final ObjectReader reader;


    public JsonParser() {
        ObjectMapper mapper = new ObjectMapper();
        this .reader = mapper.readerFor(ProductDto.class);
    }

    @Override
    public boolean supportsFormat(String filename, String contentType) {
        return filename.endsWith(".json") || "application/json".equals(contentType);
    }

    @Override
    public Stream<ProductDto> parse(InputStream inputStream) {
        try {
            MappingIterator<ProductDto> iterator = reader.readValues(inputStream);

            return StreamSupport.stream(
                    Spliterators.spliteratorUnknownSize(iterator, Spliterator.ORDERED),
                    false
            ).onClose(() -> {
                try {
                    iterator.close();
                    inputStream.close();
                } catch (IOException e) {
                    throw new ImportException("Не удалось закрыть ресурсы JSON-парсера");
                }
            });
        } catch (IOException e) {
            throw new ImportException("Ошибка парсинга JSON-файла");
        }
    }
}
