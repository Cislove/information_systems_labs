package se.ifmo.coordinates;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Check;
import se.ifmo.common.AbstractEntity;

@Entity
@Getter
@Setter
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Schema(hidden = true)
@Hidden
public class Coordinates implements AbstractEntity<Integer> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double x;

    @Check(constraints = "y > -718")
    private float y; //Значение поля должно быть больше -718

    @Override
    public String getStringId() {
        return String.valueOf(id);
    }
}
