import * as React from "react";
import { DataTable, Column } from "../common/DataTable";
import { AddressDto, CoordinatesDto } from "../../api/model/";
import * as api from "../../api/backend";
import { CoordinatesForm } from "../forms/CoordinateForm";
import { errorText } from "../../api/error";

export function CoordinatesTable({ onDataChanged }: { onDataChanged?: () => void }) {
    const columns: Column<CoordinatesDto>[] = [
        { title: "ID", key: "id", render: (item: CoordinatesDto) => item.id || "ОБРАБАТЫВАЕТСЯ"},
        { title: "X", key: "x" },
        { title: "Y", key: "y" },
    ];

    const apiAdapter = {
        getAll: async (page: number, size: number) => {
            try {
                const res = await api.getOpenAPIDefinition().coordinatesGetAll({
                    pageNumber: page,
                    size: size,
                });
                return {
                    content: res.data.content || [],
                    totalSize: res.data.totalSize || 0,
                };
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        create: async (values: Partial<Omit<CoordinatesDto, "id">>) => {
            try {
                const { id, ...createData } = values as any;
                const res = await api.getOpenAPIDefinition().coordinatesCreate(createData);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        update: async (values: Partial<CoordinatesDto>) => {
            try {
                const res = await api.getOpenAPIDefinition().coordinatesUpdate(values as any);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        delete: async (id: number) => {
            try {
                await api.getOpenAPIDefinition().coordinatesDelete(id);
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
    };

    return (
        <DataTable<CoordinatesDto>
            columns={columns}
            api={apiAdapter}
            FormComponent={CoordinatesForm}
            resourceKey={"coordinates"}
            uploadEnabled={true}
            onDataChanged={onDataChanged}
        />
    );
}