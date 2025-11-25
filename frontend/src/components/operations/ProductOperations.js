import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi.js';
import { productOperationsService } from '../../services/api.js';

const ProductOperations = () => {
    const [percent, setPercent] = useState('');
    const [rating, setRating] = useState('');
    const [selectedUnits, setSelectedUnits] = useState([]);

    const { data: ratingSum, execute: getRatingSum } = useApi(
        productOperationsService.getRatingSum,
        null,
        false
    );

    const { data: ratingGroups, execute: getRatingGroups } = useApi(
        productOperationsService.getRatingCountOfGroups,
        null,
        false
    );

    const { data: ratingCount, execute: getRatingCount } = useApi(
        () => productOperationsService.getRatingCountGreaterThan(parseFloat(rating)),
        null,
        false
    );

    const { data: productsByUnit, execute: getProductsByUnit } = useApi(
        () => productOperationsService.getProductsByUnitOfMeasure(selectedUnits),
        null,
        false
    );

    const handleReducePrice = async () => {
        if (percent && percent >= 0 && percent <= 100) {
            try {
                await productOperationsService.reducePrice(parseFloat(percent));
                alert('Цены успешно снижены!');
                setPercent('');
            } catch (error) {
                alert('Ошибка при снижении цен');
            }
        }
    };

    const unitOptions = ['METERS', 'CENTIMETERS', 'LITERS', 'GRAMS', 'MILLIGRAMS'];

    const toggleUnit = (unit) => {
        setSelectedUnits(prev =>
            prev.includes(unit)
                ? prev.filter(u => u !== unit)
                : [...prev, unit]
        );
    };

    return (
        <div className="product-operations">
            <h2>Операции с продукцией</h2>

            <div className="operation-section">
                <h3>Снижение цен</h3>
                <div className="input-group">
                    <input
                        type="number"
                        value={percent}
                        onChange={(e) => setPercent(e.target.value)}
                        placeholder="Процент снижения (0-100)"
                        min="0"
                        max="100"
                    />
                    <button onClick={handleReducePrice}>Снизить цены</button>
                </div>
            </div>

            <div className="operation-section">
                <h3>Сумма рейтингов</h3>
                <button onClick={getRatingSum}>Рассчитать сумму</button>
                {ratingSum !== null && (
                    <p>Сумма рейтингов: {ratingSum}</p>
                )}
            </div>

            <div className="operation-section">
                <h3>Группировка по рейтингу</h3>
                <button onClick={getRatingGroups}>Сгруппировать</button>
                {ratingGroups && (
                    <div>
                        <h4>Количество в группах:</h4>
                        <ul>
                            {Object.entries(ratingGroups).map(([group, count]) => (
                                <li key={group}>Рейтинг {group}: {count} объектов</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="operation-section">
                <h3>Объекты с рейтингом больше заданного</h3>
                <div className="input-group">
                    <input
                        type="number"
                        step="0.01"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="Минимальный рейтинг"
                    />
                    <button onClick={getRatingCount}>Найти</button>
                </div>
                {ratingCount !== null && (
                    <p>Количество объектов: {ratingCount}</p>
                )}
            </div>

            <div className="operation-section">
                <h3>Продукция по единицам измерения</h3>
                <div className="unit-selection">
                    {unitOptions.map(unit => (
                        <label key={unit}>
                            <input
                                type="checkbox"
                                checked={selectedUnits.includes(unit)}
                                onChange={() => toggleUnit(unit)}
                            />
                            {unit}
                        </label>
                    ))}
                </div>
                <button onClick={getProductsByUnit}>Найти продукцию</button>
                {productsByUnit && (
                    <div>
                        <h4>Найденная продукция:</h4>
                        <ul>
                            {productsByUnit.map(product => (
                                <li key={product.id}>{product.name} - {product.unitOfMeasure}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductOperations;