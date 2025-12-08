import * as React from "react";
import { DataTable, Column } from "../common/DataTable";
import { AddressDto, CoordinatesDto, LocationDto } from "../../api/model/";
import * as api from "../../api/backend";
import { CoordinatesForm } from "../forms/CoordinateForm";
import { LocationForm } from "../forms/LocationForm";
import { errorText } from "../../api/error";

export function LocationTable({ onDataChanged }: { onDataChanged?: () => void }) {
    const columns: Column<LocationDto>[] = [
        { title: "ID", key: "id", render: (item: LocationDto) => item.id || "ОБРАБАТЫВАЕТСЯ"},
        { title: "X", key: "x" },
        { title: "Y", key: "y" },
        { title: "Z", key: "z" },
    ];

    const apiAdapter = {
        getAll: async (page: number, size: number) => {
            try {
                const res = await api.getOpenAPIDefinition().locationGetAll({
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
        getAvailableFields: async () => {
            try {
                const res = await api.getOpenAPIDefinition().locationGetSearchFields();
                return { content: res.data };
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        create: async (values: Partial<Omit<LocationDto, "id">>) => {
            try {
                const { id, ...createData } = values as any;
                const res = await api.getOpenAPIDefinition().locationCreate(createData);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        update: async (values: Partial<LocationDto>) => {
            try {
                const res = await api.getOpenAPIDefinition().locationUpdate(values as any);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        delete: async (id: number) => {
            try {
                await api.getOpenAPIDefinition().locationDelete(id);
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
    };

    return (
        <DataTable<LocationDto>
            columns={columns}
            api={apiAdapter}
            FormComponent={LocationForm}
            resourceKey={"location"}
            uploadEnabled={true}
            onDataChanged={onDataChanged}
        />
    );
}