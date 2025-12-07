package se.ifmo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
//TODO: пофиксить обновление ласт импортов при изменении таблицы
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}