import * as React from "react";
import {
    AddressDto,
    CoordinatesDto,
    OrganizationDto,
    OrganizationDtoType,
    PersonDto,
    PersonDtoEyeColor, PersonDtoHairColor, PersonDtoNationality
} from "../../api/model";
import { GenericForm} from "../common/CreateForm";
import {DataField} from "../common/types/types";

type PersonCreateData = Omit<PersonDto, 'id'>;

const initialValues: Partial<PersonDto> = {
    name: "Ilnar",
    eyeColor: "BLUE",
    hairColor: "BLUE",
    location: {
        id: 1
    },
    nationality: "USA"
};

export const personFields: DataField<PersonCreateData>[] = [
    {
        key: "name",
        label: "Имя",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите имя";
            return null;
        }
    },
    {
        key: "eyeColor",
        label: "Цвет глаз",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите цвет глаз";
            if (!(Object.values(PersonDtoEyeColor).includes(value as PersonDtoEyeColor)))
                return "Неправильный цвет"
            return null;
        },
    },
    {
        key: "hairColor",
        label: "Цвет волос",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите цвет волос";
            if (!(Object.values(PersonDtoHairColor).includes(value as PersonDtoHairColor)))
                return "Неправильный цвет"
            return null;
        },
    },
    {
        key: "location",
        label: "ID позиции",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите ID";
            if (value <= 0) return "ID должен быть больше нуля";
            return null;
        },
    },
    {
        key: "birthday",
        label: "День рождения",
        type: "date",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите дату";
            return null;
        }
    },
    {
        key: "nationality",
        label: "Национальность",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите национальность";
            if (!(Object.values(PersonDtoNationality).includes(value as PersonDtoNationality)))
                return "Неправильная национальность"
            return null;
        },
    },
];

export function PersonForm(props: {
    onSubmit: (values: Partial<CoordinatesDto>) => Promise<void>;
    onCancel: () => void;
}) {

    return (
        <GenericForm<PersonDto>
            fields={personFields}
            initialValues={initialValues}
            onSubmit={async (formValues) => {
                const apiData = {
                    name: formValues.name,
                    eyeColor: formValues.eyeColor as PersonDtoEyeColor,
                    hairColor: formValues.hairColor as PersonDtoHairColor,
                    location: {
                        id: formValues.location as any
                    },
                    birthday: formValues.birthday?.toString(),
                    nationality:  formValues.nationality as PersonDtoNationality
                };
                await props.onSubmit(apiData as Partial<PersonDto>);
            }}
            onCancel={props.onCancel}
        />
    );
}