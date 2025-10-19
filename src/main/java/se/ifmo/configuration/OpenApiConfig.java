package se.ifmo.configuration;

import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OperationCustomizer uniqueOperationIdCustomizer() {
        return (operation, handlerMethod) -> {
            String className = handlerMethod.getBeanType().getSimpleName().replace("Controller", "").toLowerCase();
            String methodName = handlerMethod.getMethod().getName();
            methodName = methodName.substring(0, 1).toUpperCase() + methodName.substring(1);
            operation.setOperationId(className + methodName);
            return operation;
        };
    }
}
