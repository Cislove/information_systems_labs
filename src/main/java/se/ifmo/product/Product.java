package se.ifmo.product;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.CreationTimestamp;
import se.ifmo.common.AbstractEntity;
import se.ifmo.coordinates.Coordinates;
import se.ifmo.organization.Organization;
import se.ifmo.person.Person;
import se.ifmo.model.UnitOfMeasure;

import java.util.Date;

@Entity
@Getter
@Setter
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Schema(hidden = true)
public class Product implements AbstractEntity<Integer> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; //Поле не может быть null, Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически

    @Column(nullable = false)
    @Check(constraints = "length(name) > 0")
    private String name; //Поле не может быть null, Строка не может быть пустой

    @ManyToOne
    @JoinColumn(name = "coordinates_id",nullable = false)
    private Coordinates coordinates; //Поле не может быть null

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Date creationDate; //Поле не может быть null, Значение этого поля должно генерироваться автоматически

    @Enumerated(EnumType.STRING)
    private UnitOfMeasure unitOfMeasure; //Поле может быть null

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization manufacturer; //Поле может быть null

    @Check(constraints = "price is null or price > 0")
    private Double price; //Поле может быть null, Значение поля должно быть больше 0

    private int manufactureCost;

    @Check(constraints = "price is null or price > 0")
    private Float rating; //Поле может быть null, Значение поля должно быть больше 0

    @Column(nullable = false)
    private String partNumber; //Поле не может быть null

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person owner; //Поле может быть null

    @Override
    public String getStringId() {
        return String.valueOf(id);
    }
}
