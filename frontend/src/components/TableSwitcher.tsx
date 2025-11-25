import React, { useState } from "react";
import { CoordinatesTable } from "./tables/CoordinatesTable";
import { AddressTable } from "./tables/AddressTable";
import { LocationTable } from "./tables/LocationTable";
import { OrganizationTable } from "./tables/OrganizationTable";
import { PersonTable } from "./tables/PersonTable";
import { ProductTable } from "./tables/ProductTable";

export function TablesSwitcher() {
    const [activeTable, setActiveTable] = useState<
        "coordinates" | "address" | "location" | "organization" | "person" | "product"
    >("coordinates");

    const buttons: { key: typeof activeTable; label: string }[] = [
        { key: "coordinates", label: "Координаты" },
        { key: "address", label: "Адреса" },
        { key: "location", label: "Локации" },
        { key: "organization", label: "Организации" },
        { key: "person", label: "Люди" },
        { key: "product", label: "Продукты" }
    ];

    return (
        <div className="switcher-wrapper">
            <h1 className="switcher-title">Тюнит симулятор?☺</h1>
            <div className="switcher-bar" role="tablist" aria-label="Выбор таблицы">
                {buttons.map(b => (
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
            <div className="switcher-table-surface">
                {activeTable === "coordinates" && <CoordinatesTable />}
                {activeTable === "address" && <AddressTable />}
                {activeTable === "location" && <LocationTable />}
                {activeTable === "organization" && <OrganizationTable />}
                {activeTable === "person" && <PersonTable />}
                {activeTable === "product" && <ProductTable />}
            </div>
        </div>
    );
}

