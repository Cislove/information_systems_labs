import * as React from "react";
import {AddressDto, CoordinatesDto} from "../../api/model";
import { GenericForm} from "../common/CreateForm";
import {DataField} from "../common/types/types";

type AddressCreateData = Omit<AddressDto, 'id'>;

const initialValues: Partial<AddressDto> = {
    street: "ул.Пушкина",
    zipCode: "12345678",
    town: {
        id: -1
    }
};

export const addressFields: DataField<AddressCreateData>[] = [
    {
        key: "street",
        label: "улица",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите улицу";
            return null;
        }
    },
    {
        key: "zipCode",
        label: "zip code",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите zip code";
            if (isNaN(Number(value))) return "zip code должен состоять только из цифр";
            return null;
        },
    },
    {
        key: "town",
        label: "ID города",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите ID города";
            if (value <= 0) return "ID может быть только положительным целым числом";
            return null;
        },
    }
];

export function AddressForm(props: {
    onSubmit: (values: Partial<CoordinatesDto>) => Promise<void>;
    onCancel: () => void;
}) {

    return (
        <GenericForm<AddressDto>
            fields={addressFields}
            initialValues={initialValues}
            onSubmit={async (formValues) => {
                const apiData = {
                    street: formValues.street,
                    zipCode: formValues.zipCode,
                    town: {
                        id: Number((formValues as any).town)
                    }
                };
                await props.onSubmit(apiData as Partial<AddressDto>);
            }}
            onCancel={props.onCancel}
        />
    );
}