import * as React from "react";
import { Column, DataTable } from "../common/DataTable";
import { AddressDto, AddressSearchParams } from "../../api/model/";
import * as api from "../../api/backend";
import { addressFields, AddressForm } from "../forms/AddressForm";
import { personFields } from "../forms/PersonForm";
import { errorText } from "../../api/error";

export function AddressTable({ onDataChanged }: { onDataChanged?: () => void }) {
    const columns: Column<AddressDto>[] = [
        { title: "ID", key: "id", render: (item: AddressDto) => item.id || "ОБРАБАТЫВАЕТСЯ"},
        { title: "Улица", key: "street" },
        { title: "Zip code", key: "zipCode" },
        {
            title: "ID города",
            key: "id" as any,
            render: (item: AddressDto) => item.town?.id || "ОБРАБАТЫВАЕТСЯ",
        },
    ];

    const apiAdapter = {
        getAll: async (page: number, size: number) => {
            try {
                const res = await api.getOpenAPIDefinition().addressGetAll({
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
        getWithFilters: async (page: number, size: number, filters?: { [key: string]: string }) => {
            try {
                let res;
                if (filters) {
                    const flatParams: any = { pageNumber: page, size };
                    for (const [k, v] of Object.entries(filters)) flatParams[k] = v;
                    res = await api.getOpenAPIDefinition().addressSearch(flatParams);
                } else {
                    res = await api.getOpenAPIDefinition().addressGetAll({ pageNumber: page, size });
                }
                return {
                    content: res.data.content || [],
                    totalSize: res.data.totalSize || 0,
                };
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        create: async (values: Partial<Omit<AddressDto, "id">>) => {
            try {
                const { id, ...createData } = values as any;
                const res = await api.getOpenAPIDefinition().addressCreate(createData);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        update: async (values: Partial<AddressDto>) => {
            try {
                const res = await api.getOpenAPIDefinition().addressUpdate(values as any);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        delete: async (id: number) => {
            try {
                await api.getOpenAPIDefinition().addressDelete(id);
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
    };

    return (
        <DataTable<AddressDto>
            columns={columns}
            api={apiAdapter}
            FormComponent={AddressForm}
            filterFields={addressFields}
            resourceKey={"address"}
            uploadEnabled={true}
            onDataChanged={onDataChanged}
        />
    );
}