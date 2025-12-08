import * as React from "react";
import { Column, DataTable } from "../common/DataTable";
import {
    AddressDto,
    AddressSearchParams,
    OrganizationDto,
    PersonDto,
    PersonSearchParams,
} from "../../api/model/";
import * as api from "../../api/backend";
import { OrganizationForm } from "../forms/OrganizationForm";
import { personFields, PersonForm } from "../forms/PersonForm";
import { errorText } from "../../api/error";

export function PersonTable({ onDataChanged }: { onDataChanged?: () => void }) {
    const columns: Column<PersonDto>[] = [
        { title: "ID", key: "id", render: (item: PersonDto) => item.id || "ОБРАБАТЫВАЕТСЯ" },
        { title: "Имя", key: "name" },
        { title: "Цвет глаз", key: "eyeColor" },
        { title: "Цвет волос", key: "hairColor" },
        {
            title: "ID местоположения",
            key: "id" as any,
            render: (item: PersonDto) => item.location?.id || "ОБРАБАТЫВАЕТСЯ",
        },
        { title: "День рождения", key: "birthday" },
        { title: "Национальность", key: "nationality" },
    ];

    const apiAdapter = {
        getAll: async (page: number, size: number) => {
            try {
                const res = await api.getOpenAPIDefinition().personGetAll({
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
                    res = await api.getOpenAPIDefinition().personSearch(flatParams);
                } else {
                    res = await api.getOpenAPIDefinition().personGetAll({ pageNumber: page, size });
                }
                return {
                    content: res.data.content || [],
                    totalSize: res.data.totalSize || 0,
                };
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        create: async (values: Partial<Omit<PersonDto, "id">>) => {
            try {
                const { id, ...createData } = values as any;
                const res = await api.getOpenAPIDefinition().personCreate(createData);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        update: async (values: Partial<PersonDto>) => {
            try {
                const res = await api.getOpenAPIDefinition().personUpdate(values as any);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        delete: async (id: number) => {
            try {
                await api.getOpenAPIDefinition().personDelete(id);
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
    };

    const filterFields = personFields.filter((f) => (["name", "location"] as const).includes(f.key as any));

    return (
        <DataTable<PersonDto>
            columns={columns}
            api={apiAdapter}
            FormComponent={PersonForm}
            filterFields={filterFields}
            resourceKey={"person"}
            uploadEnabled={true}
            onDataChanged={onDataChanged}
        />
    );
}