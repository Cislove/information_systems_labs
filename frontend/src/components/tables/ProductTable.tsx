import * as React from "react";
import { Column, DataTable } from "../common/DataTable";
import { ProductDto } from "../../api/model/";
import * as api from "../../api/backend";
import { productFields, ProductForm } from "../forms/ProductForm";
import { useState } from "react";
import { errorText } from "../../api/error";

export function ProductTable() {
    const columns: Column<ProductDto>[] = [
        { title: "ID", key: "id" },
        { title: "Имя", key: "name" },
        {
            title: "ID координат",
            key: "id" as any,
            render: (item: ProductDto) => item.coordinates?.id || "-"
        },
        { title: "Дата создания", key: "creationDate" },
        { title: "Единица измерения", key: "unitOfMeasure" },
        {
            title: "ID предприятия",
            key: "id" as any,
            render: (item: ProductDto) => item.manufacturer?.id || "-"
        },
        { title: "Стоимость", key: "price" },
        { title: "Стоимость производства", key: "manufactureCost" },
        { title: "Рейтинг", key: "rating" },
        { title: "Номер серии", key: "partNumber" },
        {
            title: "ID владельца",
            key: "id" as any,
            render: (item: ProductDto) => item.owner?.id || "-"
        }
    ];

    const apiAdapter = {
        getAll: async (page: number, size: number) => {
            const res = await api.getOpenAPIDefinition().productGetAll({
                pageNumber: page,
                size: size
            });
            return {
                content: res.data.content || [],
                totalSize: res.data.totalSize || 0
            };
        },
        getWithFilters: async (page: number, size: number, filters?: { [key: string]: string }) => {
            let res;
            if (filters) {
                const flatParams: any = { pageNumber: page, size };
                for (const [k, v] of Object.entries(filters)) flatParams[k] = v;
                res = await api.getOpenAPIDefinition().productSearch(flatParams);
            } else {
                res = await api.getOpenAPIDefinition().productGetAll({ pageNumber: page, size });
            }
            return {
                content: res.data.content || [],
                totalSize: res.data.totalSize || 0
            };
        },
        update: async (values: Partial<ProductDto>) => {
            const res = await api.getOpenAPIDefinition().productUpdate(values as any);
            return res.data;
        },
        create: async (values: Partial<Omit<ProductDto, 'id'>>) => {
            const { id, ...createData } = values as any;
            const res = await api.getOpenAPIDefinition().productCreate(createData);
            return res.data;
        },
        delete: async (id: number) => {
            await api.getOpenAPIDefinition().productDelete(id);
        },
    };

    const filterFields = productFields.filter(f =>
        (['name', 'coordinates', 'manufacturer', 'price', 'manufactureCost', 'rating', 'partNumber', 'owner'] as const)
            .includes(f.key as any)
    );

    const [percent, setPercent] = useState('10');
    const [rating, setRating] = useState('5');

    const [sumRating, setSumRating] = useState<number | null>(null);
    const [ratingGroups, setRatingGroups] = useState<[string, number][]>([]);
    const [countGreater, setCountGreater] = useState<number | null>(null);

    const [tableReloadKey, setTableReloadKey] = useState(0);

    const handleReduce = async () => {
        try {
            await api.getOpenAPIDefinition().productoperationsReducePrice({ percent: Number(percent) });
            setTableReloadKey(k => k + 1);
        } catch (e: any) {
            alert(errorText(e));
        }
    };

    const handleSum = async () => {
        try {
            const sum = await api.getOpenAPIDefinition().productoperationsGetRatingSum();
            setSumRating(sum.data);
            return sum;
        } catch (e: any) {
            alert(errorText(e));
            return null;
        }
    };

    const handleGroups = async () => {
        try {
            const groups = await api.getOpenAPIDefinition().productoperationsGetRatingCountOfGroups();
            const entries = Object.entries(groups.data) as [string, number][];
            setRatingGroups(entries);
            return entries;
        } catch (e: any) {
            alert(errorText(e));
            return [];
        }
    };

    const handleCountGreater = async () => {
        try {
            const count =
                await api.getOpenAPIDefinition().productoperationsGetRatingCountOfProductWhereRatingGreaterThat(Number(rating));
            setCountGreater(count.data);
            return count;
        } catch (e: any) {
            alert(errorText(e));
            return null;
        }
    };

    return (
        <div className="product-table-wrapper">
            <div className="product-ops-bar">
                <div className="ops-group">
                    <label>
                        Снижение %:
                        <input
                            value={percent}
                            onChange={e => setPercent(e.target.value)}
                            type="number"
                            min={0}
                            className="ops-input"
                        />
                    </label>
                    <button className="ops-btn" onClick={handleReduce}>
                        Снизить цену
                    </button>
                </div>
                <div className="ops-group">
                    <button className="ops-btn" onClick={handleSum}>
                        Сумма рейтингов
                    </button>
                    <button className="ops-btn" onClick={handleGroups}>
                        Группы рейтингов
                    </button>
                </div>
                <div className="ops-group">
                    <label>
                        Рейтинг &gt;:
                        <input
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            type="number"
                            step="0.1"
                            className="ops-input"
                        />
                    </label>
                    <button className="ops-btn" onClick={handleCountGreater}>
                        Количество
                    </button>
                </div>
            </div>

            {(sumRating !== null || ratingGroups.length || countGreater !== null) && (
                <div className="operations-results">
                    {sumRating !== null && (
                        <div className="result-card">
                            <div className="result-title">Сумма рейтингов</div>
                            <div className="result-value">{sumRating}</div>
                        </div>
                    )}
                    {ratingGroups.length > 0 && (
                        <div className="result-card">
                            <div className="result-title">Группы рейтингов</div>
                            <ul className="result-list">
                                {ratingGroups.map(([r, c]) => (
                                    <li key={r}>{r}: {c}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {countGreater !== null && (
                        <div className="result-card">
                            <div className="result-title">Количество (рейтинг &gt; {rating})</div>
                            <div className="result-value">{countGreater}</div>
                        </div>
                    )}
                </div>
            )}

            <DataTable<ProductDto>
                key={tableReloadKey}
                columns={columns}
                api={apiAdapter}
                FormComponent={ProductForm}
                filterFields={filterFields}
                resourceKey={"product"}
            />
        </div>
    );
}