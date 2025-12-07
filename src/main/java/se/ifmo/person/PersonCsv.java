package se.ifmo.person;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvDate;
import com.opencsv.bean.CsvRecurse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import se.ifmo.location.LocationPersonCsv;
import se.ifmo.model.Color;
import se.ifmo.model.Country;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PersonCsv {
    @CsvBindByName(column = "owner.id")
    private Integer id;
    @CsvBindByName(column = "owner.name")
    private String name;
    @CsvBindByName(column = "owner.eyeColor")
    private Color eyeColor;
    @CsvBindByName(column = "owner.hairColor")
    private Color hairColor;
    @CsvRecurse
    private LocationPersonCsv location;

    @CsvBindByName(column = "owner.birthday")
    @CsvDate("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private Date birthday;
    @CsvBindByName(column = "owner.nationality")
    private Country nationality;

    public static PersonCsv fromDto(PersonDto dto) {
        return new PersonCsv(
                dto.id(),
                dto.name(),
                dto.eyeColor(),
                dto.hairColor(),
                LocationPersonCsv.fromDto(dto.location()),
                dto.birthday(),
                dto.nationality());
    }

    public PersonDto toDto() {
        return new PersonDto(
                id,
                name,
                eyeColor,
                hairColor,
                location.toDto(),
                birthday,
                nationality);
    }
}
