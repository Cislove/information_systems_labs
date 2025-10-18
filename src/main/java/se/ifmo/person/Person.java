package se.ifmo.person;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Check;
import se.ifmo.common.AbstractEntity;
import se.ifmo.model.Color;
import se.ifmo.model.Country;
import se.ifmo.location.Location;

import java.util.Date;

@Entity
@Getter
@Setter
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Schema(hidden = true)
public class Person implements AbstractEntity<Integer> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    @Check(constraints = "length(name) > 0")
    private String name; //Поле не может быть null, Строка не может быть пустой

    @Enumerated(EnumType.STRING)
    private Color eyeColor; //Поле может быть null

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Color hairColor; //Поле не может быть null

    @ManyToOne
    @JoinColumn(nullable = false, name = "location_id")
    private Location location; //Поле не может быть null

    private Date birthday; //Поле может быть null

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Country nationality; //Поле не может быть null

    @Override
    public String getStringId() {
        return String.valueOf(id);
    }
}
