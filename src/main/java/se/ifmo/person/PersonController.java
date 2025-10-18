package se.ifmo.person;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.RouterOperation;
import org.springdoc.core.annotations.RouterOperations;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.ifmo.common.AbstractCrudController;


@RestController
@RequestMapping("api/v1/person")
@Tag(name = "Person API", description = "Управление людьми")
//@RouterOperations({
//        @RouterOperation(path = "/api/v1/person", method = GET, beanClass = PersonController.class, beanMethod = "getAll")
//})
public class PersonController extends AbstractCrudController<
        PersonDto,
        Integer,
        PersonService
        > {
    public PersonController(PersonService service) {
        super(service);
    }
}
