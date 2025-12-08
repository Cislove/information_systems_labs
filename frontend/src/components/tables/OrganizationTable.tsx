import * as React from "react";
import { Column, DataTable } from "../common/DataTable";
import {
    AddressDto,
    AddressSearchParams,
    OrganizationDto,
    OrganizationSearchParams,
} from "../../api/model/";
import * as api from "../../api/backend";
import { organizationFields, OrganizationForm } from "../forms/OrganizationForm";
import { personFields } from "../forms/PersonForm";
import { errorText } from "../../api/error";

export function OrganizationTable({ onDataChanged }: { onDataChanged?: () => void }) {
    const columns: Column<OrganizationDto>[] = [
        { title: "ID", key: "id", render: (item: OrganizationDto) => item.id || "ОБРАБАТЫВАЕТСЯ" },
        { title: "Название", key: "name" },
        {
            title: "ID адреса",
            key: "id" as any,
            render: (item: OrganizationDto) => item.officialAddress?.id || "ОБРАБАТЫВАЕТСЯ",
        },
        { title: "Годовой оборот", key: "annualTurnover" },
        { title: "Число сотрудников", key: "employeesCount" },
        { title: "Полное название", key: "fullName" },
        { title: "Рейтинг", key: "rating" },
        { title: "Тип организации", key: "type" },
    ];

    const apiAdapter = {
        getAll: async (page: number, size: number) => {
            try {
                const res = await api.getOpenAPIDefinition().organizationGetAll({
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
                    res = await api.getOpenAPIDefinition().organizationSearch(flatParams);
                } else {
                    res = await api.getOpenAPIDefinition().organizationGetAll({ pageNumber: page, size });
                }
                return {
                    content: res.data.content || [],
                    totalSize: res.data.totalSize || 0,
                };
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        create: async (values: Partial<Omit<OrganizationDto, "id">>) => {
            try {
                const { id, ...createData } = values as any;
                const res = await api.getOpenAPIDefinition().organizationCreate(createData);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        update: async (values: Partial<OrganizationDto>) => {
            try {
                const res = await api.getOpenAPIDefinition().organizationUpdate(values as any);
                return res.data;
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
        delete: async (id: number) => {
            try {
                await api.getOpenAPIDefinition().organizationDelete(id);
            } catch (e) {
                throw new Error(errorText(e));
            }
        },
    };

    const filterFields = organizationFields.filter((f) =>
        (["name", "officialAddress", "annualTurnover", "employeesCount", "fullName", "rating"] as const).includes(
            f.key as any
        )
    );

    return (
        <DataTable<OrganizationDto>
            columns={columns}
            api={apiAdapter}
            FormComponent={OrganizationForm}
            filterFields={filterFields}
            resourceKey={"organization"}
            uploadEnabled={true}
            onDataChanged={onDataChanged}
        />
    );
}