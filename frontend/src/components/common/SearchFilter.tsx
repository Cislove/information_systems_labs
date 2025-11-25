import React, { useEffect, useMemo, useState } from "react";
import { DataField } from "./types/types";

type Filters = { [key: string]: string };

interface Props<T> {
    fields: DataField<T>[];
    getWithFilters: (page: number, size: number, filters?: Filters) => Promise<{ content: T[]; totalSize: number }>;
    onResults: (content: T[], totalSize: number) => void;
    page?: number;
    size?: number;
    onFiltersChange?: (filters: Filters | undefined) => void;
    reloadKey?: number;
}

export function SearchFilter<T>({
                                    fields,
                                    getWithFilters,
                                    onResults,
                                    page = 0,
                                    size = 10,
                                    onFiltersChange,
                                    reloadKey // <-- добавлено
                                }: Props<T>) {
    const [values, setValues] = useState<Partial<Record<keyof T, string | number>>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [loading, setLoading] = useState(false);
    const [lastFilters, setLastFilters] = useState<Filters | undefined>(undefined);
    const toggleId = React.useId();

    const isEmpty = (v: unknown) => v === "" || v === null || v === undefined;
    const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

    const activeCount = useMemo(
        () =>
            fields.reduce((acc, f) => {
                const v = values[f.key];
                return acc + (v !== undefined && v !== null && v !== "" ? 1 : 0);
            }, 0),
        [fields, values]
    );

    const onChange = (field: DataField<T>, raw: string) => {
        let parsed: any = raw;
        if (field.type === "number") {
            parsed = raw === "" ? "" : Number(raw);
            if (raw !== "" && Number.isNaN(parsed)) parsed = raw;
        }
        const key = String(field.key);
        setValues((prev) => ({ ...prev, [field.key]: parsed }));
        const err = isEmpty(parsed) ? null : field.validate ? field.validate(parsed) : null;
        setErrors((prev) => ({ ...prev, [key]: err }));
    };

    const buildFilters = (): Filters =>
        fields.reduce<Filters>((acc, f) => {
            const v = values[f.key];
            if (v !== undefined && v !== null && v !== "") {
                acc[String(f.key)] = String(v);
            }
            return acc;
        }, {});

    const fetchAndSet = async (p: number, s: number, f?: Filters) => {
        setLoading(true);
        try {
            const { content, totalSize } = await getWithFilters(p, s, f ?? {});
            onResults(content, totalSize);
        } finally {
            setLoading(false);
        }
    };

    const apply = async () => {
        const newErrors: Record<string, string | null> = {};
        fields.forEach((f) => {
            const val = values[f.key];
            newErrors[String(f.key)] = isEmpty(val) ? null : f.validate ? f.validate(val) : null;
        });
        setErrors(newErrors);
        if (Object.values(newErrors).some((e) => e)) return;

        const filters = buildFilters();
        setLastFilters(filters);
        onFiltersChange?.(filters);
        await fetchAndSet(page, size, filters);
    };

    const reset = async () => {
        setValues({});
        setErrors({});
        setLastFilters(undefined);
        onFiltersChange?.(undefined);
        await fetchAndSet(page, size, undefined);
    };

    // добавлен reloadKey в зависимости
    useEffect(() => {
        fetchAndSet(page, size, lastFilters);
    }, [page, size, reloadKey, lastFilters]);

    return (
        <div className="search-filter">
            <input id={toggleId} type="checkbox" className="search-filter__checkbox" defaultChecked />
            <label className="search-filter__toggle" htmlFor={toggleId}>
                <span>Фильтры</span>
                {activeCount > 0 && <span className="search-filter__badge">{activeCount}</span>}
            </label>

            <div className="search-filter__content">
                <div className="search-filter__fields">
                    {fields.map((f) => {
                        const key = String(f.key);
                        const value = values[f.key] ?? "";
                        return (
                            <div key={key} className="search-filter__field">
                                <label className="search-filter__label">{f.label}</label>
                                <input
                                    className={`search-filter__input ${errors[key] ? "error" : ""}`}
                                    type={f.type === "text" ? "text" : f.type}
                                    value={value}
                                    onChange={(e) => onChange(f, e.target.value)}
                                />
                                {errors[key] && <div className="search-filter__error">{errors[key]}</div>}
                            </div>
                        );
                    })}
                </div>

                <div className="search-filter__actions">
                    <button onClick={apply} disabled={loading || hasErrors}>
                        Применить
                    </button>
                    <button onClick={reset} disabled={loading}>
                        Сбросить
                    </button>
                </div>
            </div>
        </div>
    );
}
