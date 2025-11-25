import * as React from "react";
import {CoordinatesDto, OrganizationDto, OrganizationDtoType} from "../../api/model";
import { GenericForm} from "../common/CreateForm";
import {DataField} from "../common/types/types";

type OrganizationCreateData = Omit<OrganizationDto, 'id'>;

const initialValues: Partial<OrganizationDto> = {
    name: "Ilnar",
    officialAddress: {
        id: 1
    },
    annualTurnover: 1,
    employeesCount: 1,
    fullName: "Rakhimov Ilnar Ildarovich",
    rating: 1,
    type: "PUBLIC",
};

export const organizationFields: DataField<OrganizationCreateData>[] = [
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
        key: "officialAddress",
        label: "ID официального адреса",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите ID официального адреса";
            if (value <= 0) return "ID может быть только положительным целым числом";
            return null;
        },
    },
    {
        key: "annualTurnover",
        label: "Годовой оборот",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите оборот";
            if (value <= 0) return "оборот должен быть больше нуля";
            return null;
        },
    },
    {
        key: "employeesCount",
        label: "Количество сотрудников",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите количество сотрудников";
            if (value <= 0) return "количество сотрудников должно быть больше 0";
            return null;
        },
    },
    {
        key: "fullName",
        label: "Полное имя",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите полное имя";
            return null;
        }
    },
    {
        key: "rating",
        label: "Рейтинг",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите рейтинг";
            if (value <= 0) return "рейтинг должен быть больше 0";
            return null;
        },
    },
    {
        key: "type",
        label: "Тип",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите тип";
            if (!(Object.values(OrganizationDtoType).includes(value as OrganizationDtoType)))
                return "Неправильный тип"
            return null
        },
    }
];

export function OrganizationForm(props: {
    onSubmit: (values: Partial<CoordinatesDto>) => Promise<void>;
    onCancel: () => void;
}) {

    return (
        <GenericForm<OrganizationDto>
            fields={organizationFields}
            initialValues={initialValues}
            onSubmit={async (formValues) => {
                const apiData = {
                    name: formValues.name,
                    officialAddress: {
                      id: formValues.officialAddress as any
                    },
                    annualTurnover: formValues.annualTurnover,
                    employeesCount: formValues.employeesCount,
                    fullName: formValues.fullName,
                    rating: formValues.rating,
                    type:  formValues.type as OrganizationDtoType
                };
                await props.onSubmit(apiData as Partial<OrganizationDto>);
            }}
            onCancel={props.onCancel}
        />
    );
}