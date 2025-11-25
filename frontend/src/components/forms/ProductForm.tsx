import * as React from "react";
import {ProductDto, ProductDtoUnitOfMeasure} from "../../api/model";
import {GenericForm} from "../common/CreateForm";
import {DataField} from "../common/types/types";

type PersonCreateData = Omit<ProductDto, 'id'>;

const initialValues: Partial<ProductDto> = {
    name: "Ilnar",
    coordinates: {
        id: 1
    },
    unitOfMeasure: "LITERS",
    manufacturer: {
        id: 1
    },
    price: 1.1,
    manufactureCost: 1,
    rating: 5.0,
    partNumber: "1231212312312",
    owner: {
        id: 1
    }
};

export const productFields: DataField<PersonCreateData>[] = [
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
        key: "coordinates",
        label: "ID координат",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите ID";
            if (value <= 0) return "ID должен быть больше нуля";
            return null;
        },
    },
    {
        key: "unitOfMeasure",
        label: "Единица измерения",
        type: "text",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите единицу измерения";
            if (!(Object.values(ProductDtoUnitOfMeasure).includes(value as ProductDtoUnitOfMeasure)))
                return "Неправильная единица измерения"
            return null;
        },
    },
    {
        key: "manufacturer",
        label: "ID производства",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите ID";
            if (value <= 0) return "ID должен быть больше нуля";
            return null;
        },
    },
    {
        key: "price",
        label: "Стоимость",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите стоимость";
            if (value < 0.0) return "Стоимость не может быть ниже нуля";
            return null;
        },
    },
    {
        key: "manufactureCost",
        label: "Стоимость производства",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите стоимость";
            if (value < 0) return "Стоимость не может быть ниже нуля";
            return null;
        }
    },
    {
        key: "rating",
        label: "Рейтинг",
        type: "number",
        validate: (value: number) => {
            if (value === null || value === undefined)
                return "Введите рейтинг";
            return null;
        }
    },
    {
        key: "partNumber",
        label: "Номер серии",
        type: "text",
        validate: (value: string) => {
            if (value === null || value === undefined)
                return "Введите номер серии";
            return null
        }
    },
    {
        key: "owner",
        label: "ID владельца",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined)
                return "Введите ID";
            if (value <= 0) return "ID должен быть больше нуля";
            return null;
        }
    },
];

export function ProductForm(props: {
    onSubmit: (values: Partial<ProductDto>) => Promise<void>;
    onCancel: () => void;
}) {

    return (
        <GenericForm<ProductDto>
            fields={productFields}
            initialValues={initialValues}
            onSubmit={async (formValues) => {
                const apiData = {
                    name: formValues.name,
                    coordinates: {
                        id: formValues.coordinates as any
                    },
                    unitOfMeasure: formValues.unitOfMeasure as ProductDtoUnitOfMeasure,
                    manufacturer: {
                        id: formValues.manufacturer as any
                    },
                    price: formValues.price,
                    manufactureCost: formValues.manufactureCost,
                    rating: formValues.rating,
                    partNumber:  formValues.partNumber,
                    owner: {
                        id: formValues.owner as any
                    }
                };
                await props.onSubmit(apiData as Partial<ProductDto>);
            }}
            onCancel={props.onCancel}
        />
    );
}