import React from "react";
import { DataTable, DataTableApi, Column } from "../common/DataTable";
import { getOpenAPIDefinition } from "../../api/backend";
import type { ImportHistoryDto } from "../../api/model/importHistoryDto";
import type { PageDtoImportHistoryDto } from "../../api/model/pageDtoImportHistoryDto";

const apiClient = getOpenAPIDefinition();

type ImportRow = ImportHistoryDto & { id: number };

const importHistoryApi: DataTableApi<ImportRow> = {
    async getAll(page, size) {
        const res = await apiClient.importhistoryGetImportHistory({
            pageNumber: page,
            size: size,
        } as any);
        const data = (res as any).data as PageDtoImportHistoryDto;
        return {
            content: (data.content ?? []) as ImportRow[],
            totalSize: data.totalSize ?? 0,
        };
    },
};

const columns: Column<ImportRow>[] = [
    { title: "ID", key: "id" },
    { title: "Файл", key: "fileName" },
    { title: "Время импорта", key: "importTime" },
    { title: "Статус", key: "status", render: (item) => {
        if (item.status === "COMPLETED") return "✅ Завершен";
        if (item.status === "FAILED") return "❌ Ошибка";
        if (item.status === "IN_PROGRESS") return "⚙️ В процессе";
        return "⏳ Ожидание";
        } },
    { title: "Добавлено объектов", key: "addedNumberOfObjects" },
];

export const ImportTable: React.FC = () => {
    return (
        <DataTable<ImportHistoryDto>
            columns={columns}
            api={importHistoryApi}
            pageSize={10}
            resourceKey="IMPORT_HISTORY"
            uploadEnabled={false}
        />
    );
};
