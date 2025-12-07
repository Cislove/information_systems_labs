package se.ifmo.imports;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ImportException extends RuntimeException{
    public ImportException(String message) {
        super(message);
    }
}
