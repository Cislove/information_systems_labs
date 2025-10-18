package se.ifmo.location;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import se.ifmo.common.AbstractEntity;

@Entity
@Getter
@Setter
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Schema(hidden = true)
public class Location implements AbstractEntity<Integer>{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private float x;

    @Column(nullable = false)
    private Long y; //Поле не может быть null

    @Column(nullable = false)
    private Long z; //Поле не может быть null

    @Override
    public String getStringId() {
        return String.valueOf(id);
    }
}
