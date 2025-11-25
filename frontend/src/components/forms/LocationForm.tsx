import * as React from "react";
import {LocationDto} from "../../api/model";
import { GenericForm} from "../common/CreateForm";
import {DataField} from "../common/types/types";

type LocationCreateData = Omit<LocationDto, 'id'>;

const initialValues: Partial<LocationDto> = {
    x: 1.0,
    y: 1.0,
    z: 1.0
};

const coordinatesFields: DataField<LocationCreateData>[] = [
    {
        key: "x",
        label: "X координата",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите X";
            if (isNaN(Number(value))) return "X должно быть числом";
            return null;
        }
    },
    {
        key: "y",
        label: "Y координата",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите Y";
            if (isNaN(Number(value))) return "Y должно быть числом";
            return null;
        },
    },
    {
        key: "z",
        label: "Z координата",
        type: "number",
        validate: (value) => {
            if (value === null || value === undefined || value === "")
                return "Введите Z";
            if (isNaN(Number(value))) return "Z должно быть числом";
            return null;
        },
    }
];

export function LocationForm(props: {
    onSubmit: (values: Partial<LocationDto>) => Promise<void>;
    onCancel: () => void;
}) {

    return (
        <GenericForm<LocationDto>
            fields={coordinatesFields}
            initialValues={initialValues}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        />
    );
}