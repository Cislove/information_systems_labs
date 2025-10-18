package se.ifmo.address;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Check;
import se.ifmo.common.AbstractEntity;
import se.ifmo.location.Location;

@Entity
@Getter
@Setter
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Schema(hidden = true)
public class Address implements AbstractEntity<Integer> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 83)
    private String street; //Длина строки не должна быть больше 83, Поле может быть null

    @Column(nullable = false)
    @Check(constraints = "length(zip_code) >= 7")
    private String zipCode; //Длина строки должна быть не меньше 7, Поле не может быть null

    @ManyToOne
    @JoinColumn(nullable = false, name = "location_id")
    private Location town; //Поле не может быть null

    @Override
    public String getStringId() {
        return String.valueOf(id);
    }
}
