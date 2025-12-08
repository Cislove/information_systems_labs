import React, { useCallback, useEffect, useState } from "react";
import { CoordinatesTable } from "./tables/CoordinatesTable";
import { AddressTable } from "./tables/AddressTable";
import { LocationTable } from "./tables/LocationTable";
import { OrganizationTable } from "./tables/OrganizationTable";
import { PersonTable } from "./tables/PersonTable";
import { ProductTable } from "./tables/ProductTable";
import { ImportTable } from "./tables/ImportTable";
import { getOpenAPIDefinition } from "../api/backend";
import type { ImportHistoryDto } from "../api/model/importHistoryDto";

const getStatusIcon = (status?: string) => {
    if (status === "COMPLETED") return "✅";
    if (status === "FAILED") return "❌";
    if (status === "IN_PROGRESS") return "⚙️";
    return "⏳";
};

const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export function TablesSwitcher() {
    const [activeTable, setActiveTable] = useState<
        "coordinates" | "address" | "location" | "organization" | "person" | "product" | "importHistory"
    >("coordinates");

    const [lastImports, setLastImports] = useState<ImportHistoryDto[]>([]);
    const [lastImportsLoading, setLastImportsLoading] = useState(false);
    const [lastImportsError, setLastImportsError] = useState<string | null>(null);

    const buttons: { key: typeof activeTable; label: string }[] = [
        { key: "coordinates", label: "Координаты" },
        { key: "address", label: "Адреса" },
        { key: "location", label: "Локации" },
        { key: "organization", label: "Организации" },
        { key: "person", label: "Люди" },
        { key: "product", label: "Продукты" },
        { key: "importHistory", label: "История импортов" },
    ];

    const loadLastImports = useCallback(async () => {
        try {
            setLastImportsLoading(true);
            setLastImportsError(null);
            const api = getOpenAPIDefinition();
            const res = await api.importhistoryGetImportHistory({ limit: 5 } as any);
            const data = (res as any).data;
            if (Array.isArray(data)) {
                setLastImports(data as ImportHistoryDto[]);
            } else if (data && Array.isArray(data.content)) {
                setLastImports(data.content as ImportHistoryDto[]);
            } else {
                setLastImports([]);
            }
        } catch (e: any) {
            setLastImportsError(e?.message ?? "Не удалось загрузить последние импорты");
            setLastImports([]);
        } finally {
            setLastImportsLoading(false);
        }
    }, []);

    useEffect(() => {
        if(activeTable !== "importHistory") {
            loadLastImports();
        }
    }, [loadLastImports, activeTable]);

    const handleDataChanged = useCallback(() => {
        loadLastImports();
    }, [loadLastImports]);

    const formatAdded = (item: ImportHistoryDto) => {
        if (item.addedNumberOfObjects == null) return "—";
        return `Добавлено объектов: ${item.addedNumberOfObjects}`;
    };

    return (
        <div className="switcher-wrapper">
            <h1 className="switcher-title">Тюнит симулятор?☺</h1>

            {/* Верхний ряд: табы слева, импорты справа (кроме вкладки importHistory) */}
            <div className="switcher-row">
                <div className="switcher-main">
                    <div className="switcher-bar" role="tablist" aria-label="Выбор таблицы">
                        {buttons.map((b) => (
                            <button
                                key={b.key}
                                role="tab"
                                aria-selected={activeTable === b.key}
                                className={`switcher-button ${activeTable === b.key ? "switcher-button--active" : ""}`}
                                onClick={() => setActiveTable(b.key)}
                                disabled={activeTable === b.key}
                            >
                                <span className="switcher-button-text">{b.label}</span>
                                {activeTable === b.key && <span className="switcher-active-indicator" />}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTable !== "importHistory" && (
                    <aside className="imports-wrapper">
                        <div className="imports-panel">
                            <div className="imports-panel__header">
                                <h2 className="imports-panel__title">Последние импорты</h2>
                                {lastImportsLoading && <span className="imports-panel__badge">Загрузка…</span>}
                                {lastImportsError && (
                                    <span className="imports-panel__badge imports-panel__badge--error">
                                        {lastImportsError}
                                    </span>
                                )}
                            </div>
                            {!lastImportsLoading && !lastImportsError && (
                                <ul className="imports-panel__list">
                                    {lastImports.length === 0 && (
                                        <li className="imports-panel__empty">Нет данных об импортах</li>
                                    )}
                                    {lastImports.slice(0, 5).map((item) => (
                                        <li key={item.id} className="imports-panel__item">
                                            <div className="imports-panel__file">
                                                <span className="imports-panel__status-icon">
                                                    {getStatusIcon(item.status as any)}
                                                </span>
                                                <span className="imports-panel__file-name">{item.fileName}</span>
                                            </div>
                                            <div className="imports-panel__meta imports-panel__meta--column">
                                                <span className="imports-panel__time">
                                                    Время: {formatTime(item.importTime as any)}
                                                </span>
                                                <span className="imports-panel__count">{formatAdded(item)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>
                )}
            </div>

            {/* Контент таблиц на всю ширину, как раньше */}
            <div className="switcher-table-surface">
                {activeTable === "coordinates" && <CoordinatesTable onDataChanged={handleDataChanged} />}
                {activeTable === "address" && <AddressTable onDataChanged={handleDataChanged} />}
                {activeTable === "location" && <LocationTable onDataChanged={handleDataChanged} />}
                {activeTable === "organization" && <OrganizationTable onDataChanged={handleDataChanged} />}
                {activeTable === "person" && <PersonTable onDataChanged={handleDataChanged} />}
                {activeTable === "product" && <ProductTable onDataChanged={handleDataChanged} />}
                {activeTable === "importHistory" && <ImportTable />}
            </div>
        </div>
    );
}
