package se.ifmo.imports.parser;

import se.ifmo.product.Product;
import se.ifmo.product.ProductDto;

import java.io.InputStream;
import java.util.stream.Stream;

public interface FileParser {
    boolean supportsFormat(String filename, String contentType);
    Stream<ProductDto> parse(InputStream inputStream);
}
