import * as React from "react";
import { CoordinatesDto } from "../../api/model";
import { GenericForm} from "../common/CreateForm";
import {DataField} from "../common/types/types";

type CoordinatesCreateData = Omit<CoordinatesDto, 'id'>;

const initialValues: Partial<CoordinatesDto> = {
    x: 1.0,
    y: 1.0
};

export const coordinatesFields: DataField<CoordinatesCreateData>[] = [
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
    }
];

export function CoordinatesForm(props: {
    onSubmit: (values: Partial<CoordinatesDto>) => Promise<void>;
    onCancel: () => void;
}) {

    return (
        <GenericForm<CoordinatesDto>
            fields={coordinatesFields}
            initialValues={initialValues}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        />
    );
}