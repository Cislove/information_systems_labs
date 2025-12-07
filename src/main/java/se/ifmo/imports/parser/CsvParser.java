package se.ifmo.imports.parser;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import org.springframework.stereotype.Component;
import se.ifmo.product.ProductCsv;
import se.ifmo.product.ProductDto;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Stream;

@Component
public class CsvParser implements FileParser {
    private final HeaderColumnNameMappingStrategy<ProductCsv> strategy;

    public CsvParser() {
        strategy = new HeaderColumnNameMappingStrategy<>();
        strategy.setType(ProductCsv.class);
    }

    @Override
    public boolean supportsFormat(String filename, String contentType) {
        return filename.endsWith(".csv") || "application/csv".equals(contentType);
    }

    @Override
    public Stream<ProductDto> parse(InputStream inputStream) {
        var reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
        var csvToBean = new CsvToBeanBuilder<ProductCsv>(reader)
                .withMappingStrategy(strategy)
                .withIgnoreLeadingWhiteSpace(true)
                .build();

        return csvToBean.stream()
                .map(ProductCsv::toDto)
                .onClose(() -> {
                    try {
                        reader.close();
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to parse CSV");
                    }
                });
    }
}
