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
    create?: (values: Partial<Omit<T, "id">>) => Promise<number>;
    update?: (values: Partial<T>) => Promise<void>;
    delete?: (id: number) => Promise<void>;
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
    uploadEnabled: boolean;
    onDataChanged?: () => void;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    api,
    pageSize = 10,
    filterFields,
    FormComponent,
    resourceKey,
    uploadEnabled,
    onDataChanged
}: DataTableProps<T>) {
    const [data, setData] = React.useState<T[]>([]);
    const [page, setPage] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [showForm, setShowForm] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<Partial<T> | null>(null);
    const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const [reloadTick, setReloadTick] = React.useState(0);

    const { toasts, remove } = useNotifications();

    const filtersEnabled = !!(filterFields && api.getWithFilters);
    const hasCreate = !!api.create && !!FormComponent;
    const hasUpdate = !!api.update && !!FormComponent;
    const hasDelete = !!api.delete;
    const hasActions = hasUpdate || hasDelete;

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

    // Обработка уведомлений из сокета
    React.useEffect(() => {
        const last = toasts[toasts.length - 1];
        if (!last) return;
        const dto: NotificationDto = last.dto;

        // 1) allIds: всегда обновляем текущую таблицу, тост не показываем
        if (dto.allIds) {
            remove(last.id);
            if (filtersEnabled && api.getWithFilters) {
                setReloadTick((t) => t + 1);
            } else {
                loadData();
            }
            onDataChanged?.();
            return;
        }

        // 2) обычное entity-уведомление только для своей таблицы
        if (dto.entityType === resourceKey) {
            remove(last.id);
            if (filtersEnabled && api.getWithFilters) {
                setReloadTick((t) => t + 1);
            } else {
                loadData();
            }
            onDataChanged?.();
        }
    }, [toasts, resourceKey, filtersEnabled, api.getWithFilters, loadData, remove, onDataChanged]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadProgress(0);
            setErrorMsg(null);

            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    setUploadProgress(progress);
                }
            });

            await new Promise<void>((resolve, reject) => {
                xhr.addEventListener("load", () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        try {
                            const errorResponse = JSON.parse(xhr.responseText);
                            reject(new Error(errorResponse.errorMessage || `HTTP ${xhr.status}`));
                        } catch {
                            reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
                        }
                    }
                });
                xhr.addEventListener("error", () => reject(new Error("Ошибка сети")));
                xhr.addEventListener("abort", () => reject(new Error("Загрузка отменена")));

                xhr.open("POST", `http://localhost:8080/api/import/upload`);
                xhr.send(formData);
            });

            setUploadProgress(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (filtersEnabled) {
                setReloadTick((t) => t + 1);
            } else {
                loadData();
            }
        } catch (e) {
            setErrorMsg(errorText(e));
            setUploadProgress(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!api.delete) return;
        try {
            if (!window.confirm("Удалить запись?")) return;
            await api.delete(id);
            if (filtersEnabled) {
                setReloadTick((t) => t + 1);
            } else {
                loadData();
            }
            onDataChanged?.();
        } catch (e) {
            setErrorMsg(errorText(e));
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="data-table-container">
            <div className="data-table-header">
                <h2>Таблица</h2>
                {hasCreate && (
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

            {uploadEnabled && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{display: "none"}}
                        onChange={handleFileUpload}
                        disabled={uploadProgress !== null}
                    />
                    <button
                        className="data-table-upload-button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadProgress !== null}
                    >
                        <span className="data-table-upload-icon">📤</span>
                        <span className="data-table-upload-text">
                            {uploadProgress !== null ? "Загрузка..." : "Загрузить файл"}
                        </span>
                    </button>
                </>
            )}

            {uploadProgress !== null && (
                <div style={{ marginBottom: 12 }}>
                    <div style={{ marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
                        Загрузка файла: {Math.round(uploadProgress)}%
                    </div>
                    <div style={{
                        width: "100%",
                        height: 20,
                        background: "#e0e0e0",
                        borderRadius: 4,
                        overflow: "hidden"
                    }}>
                        <div
                            style={{
                                width: `${uploadProgress}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                                transition: "width 0.3s ease",
                            }}
                        />
                    </div>
                </div>
            )}


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
                        {hasActions && <th>Действия</th>}
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
                            {hasActions && (
                                <td>
                                    {hasUpdate && (
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
                                    )}
                                    {hasDelete && (
                                        <button
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(+row.id)}
                                            aria-label="Удалить запись"
                                        >
                                            <span className="action-icon">🗑</span>
                                            <span className="action-text">Удалить</span>
                                        </button>
                                    )}
                                </td>
                            )}
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

            {showForm && FormComponent && hasUpdate && (
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
                                                if (api.update) {
                                                    await api.update({ ...values, id: editingItem.id });
                                                }
                                            } else {
                                                if (api.create) {
                                                    await api.create(values);
                                                }
                                            }
                                            setShowForm(false);
                                            if (filterFields && api.getWithFilters) {
                                                setReloadTick((t) => t + 1);
                                            } else {
                                                loadData();
                                            }
                                            onDataChanged?.();
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
