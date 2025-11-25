import * as React from "react";
import { SearchFilter } from "./SearchFilter";
import { DataField } from "./types/types";
import { useNotifications } from "../notifications/NotificationProvider";
import { NotificationDto } from "../../api/notification";
import { errorText } from "../../api/error";

export interface Column<T> {
    title: String;
    key: keyof T;
    render?: (item: T) => React.ReactNode;
}

export interface DataTableApi<T> {
    getAll: (page: number, size: number) => Promise<{ content: T[]; totalSize: number }>;
    getWithFilters?: (page: number, size: number, filters?: { [key: string]: string }) => Promise<{ content: T[]; totalSize: number }>;
    create: (values: Partial<Omit<T, "id">>) => Promise<number>;
    update: (values: Partial<T>) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    api: DataTableApi<T>;
    pageSize?: number;
    filterFields?: DataField<T>[];
    FormComponent?: React.ComponentType<{
        onSubmit: (values: Partial<T>) => Promise<void>;
        onCancel: () => void;
        initialValues?: Partial<T>;
    }>;
    resourceKey: string;
}

export function DataTable<T extends { id: string | number }>({
                                                                 columns,
                                                                 api,
                                                                 pageSize = 10,
                                                                 filterFields,
                                                                 FormComponent,
                                                                 resourceKey,
                                                             }: DataTableProps<T>) {
    const [data, setData] = React.useState<T[]>([]);
    const [page, setPage] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<Partial<T> | null>(null);

    // баннер ошибки
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    // тикер для перезагрузки в режиме фильтров
    const [reloadTick, setReloadTick] = React.useState(0);

    const { toasts, remove } = useNotifications();

    const filtersEnabled = !!(filterFields && api.getWithFilters);

    const loadData = React.useCallback(async () => {
        if (filtersEnabled) return;
        try {
            setLoading(true);
            setErrorMsg(null);
            const result = await api.getAll(page, pageSize);
            setData(result.content || []);
            setTotal(result.totalSize || 0);
        } catch (err) {
            setErrorMsg(errorText(err));
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, api, filtersEnabled]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    // Реакция на уведомления: в режиме фильтров дергаем перезагрузку SearchFilter
    React.useEffect(() => {
        const last = toasts[toasts.length - 1];
        if (!last) return;
        const dto: NotificationDto = last.dto;

        if (dto.entityType === resourceKey) {
            remove(last.id);
            if (filtersEnabled) {
                setReloadTick((t) => t + 1);
            } else {
                loadData();
            }
        }
    }, [toasts, resourceKey, filtersEnabled, loadData, remove]);

    const handleDelete = async (id: number) => {
        try {
            if (!api.delete) return;
            if (!window.confirm("Удалить запись?")) return;
            await api.delete(id);
            if (filtersEnabled) {
                setReloadTick((t) => t + 1);
            } else {
                loadData();
            }
        } catch (e) {
            setErrorMsg(errorText(e));
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="data-table-container">
            <div className="data-table-header">
                <h2>Таблица</h2>
                {FormComponent && (
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setShowForm(true);
                        }}
                    >
                        ➕ Добавить
                    </button>
                )}
            </div>

            {errorMsg && (
                <div
                    role="alert"
                    style={{
                        background: "#ffe2e2",
                        color: "#b00000",
                        padding: 8,
                        border: "1px solid #ffb3b3",
                        borderRadius: 4,
                        marginBottom: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 14
                    }}
                >
                    <span>{errorMsg}</span>
                    <button
                        onClick={() => setErrorMsg(null)}
                        aria-label="Закрыть"
                        style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: "#b00000" }}
                    >
                        ×
                    </button>
                </div>
            )}

            {filterFields && api.getWithFilters && (
                <SearchFilter<T>
                    reloadKey={reloadTick}
                    fields={filterFields}
                    getWithFilters={api.getWithFilters}
                    onResults={(content, totalSize) => {
                        setData(content);
                        setTotal(totalSize);
                    }}
                    page={page}
                    size={pageSize}
                    // Если в вашем SearchFilter есть try/catch — прокиньте ошибку сюда:
                    // onError={(e) => setErrorMsg(errorText(e))}
                />
            )}

            {loading ? (
                <p className="loading-text">Загрузка...</p>
            ) : (
                <table className="data-table">
                    <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={String(col.key)}>{col.title}</th>
                        ))}
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {columns.map((col) => (
                                <td key={String(col.key)}>
                                    {col.render ? col.render(row) : (row[col.key] as any)}
                                </td>
                            ))}
                            <td>
                                <button
                                    className="action-button edit-button"
                                    onClick={() => {
                                        setEditingItem(row);
                                        setShowForm(true);
                                    }}
                                    aria-label="Редактировать запись"
                                >
                                    <span className="action-icon">✏</span>
                                    <span className="action-text">Редактировать</span>
                                </button>
                                <button
                                    className="action-button delete-button"
                                    onClick={() => handleDelete(+row.id)}
                                    aria-label="Удалить запись"
                                >
                                    <span className="action-icon">🗑</span>
                                    <span className="action-text">Удалить</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-button"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page <= 0}
                    >
                        Назад
                    </button>
                    <span className="pagination-info">
            Страница {page + 1} из {totalPages}
          </span>
                    <button
                        className="pagination-button"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Вперед
                    </button>
                </div>
            )}

            {showForm && FormComponent && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setShowForm(false)}
                >
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <button
                                className="modal-close"
                                aria-label="Close"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                            <div className="modal-body">
                                <FormComponent
                                    initialValues={editingItem || undefined}
                                    onSubmit={async (values) => {
                                        try {
                                            setErrorMsg(null);
                                            if (editingItem && editingItem.id) {
                                                await api.update({ ...values, id: editingItem.id });
                                            } else {
                                                await api.create(values);
                                            }
                                            setShowForm(false);
                                            if (filterFields && api.getWithFilters) {
                                                setReloadTick((t) => t + 1);
                                            } else {
                                                loadData();
                                            }
                                        } catch (e) {
                                            setErrorMsg(errorText(e));
                                        }
                                    }}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingItem(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}