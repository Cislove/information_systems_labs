// import React, { useState } from 'react';
// // import Pagination from './Pagination';
//
// const DataTable = ({
//                        data,
//                        columns,
//                        onEdit,
//                        onDelete,
//                        onView,
//                        pageNumber,
//                        pageSize,
//                        totalSize,
//                        onPageChange,
//                        onSort,
//                        onFilter
//                    }) => {
//     const [sortField, setSortField] = useState('');
//     const [sortDirection, setSortDirection] = useState('asc');
//     const [filters, setFilters] = useState({});
//
//     const handleSort = (field) => {
//         const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
//         setSortField(field);
//         setSortDirection(direction);
//         onSort && onSort(field, direction);
//     };
//
//     const handleFilter = (field, value) => {
//         const newFilters = { ...filters, [field]: value };
//         setFilters(newFilters);
//         onFilter && onFilter(newFilters);
//     };
//
//     return (
//         <div className="data-table">
//             <table>
//                 <thead>
//                 <tr>
//                     {columns.map(column => (
//                         <th key={column.key} onClick={() => handleSort(column.key)}>
//                             {column.title}
//                             {sortField === column.key && (
//                                 <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
//                             )}
//                         </th>
//                     ))}
//                     <th>Действия</th>
//                 </tr>
//                 <tr>
//                     {columns.map(column => (
//                         <th key={`filter-${column.key}`}>
//                             {column.filterable && (
//                                 <input
//                                     type="text"
//                                     placeholder={`Фильтр ${column.title}`}
//                                     onChange={(e) => handleFilter(column.key, e.target.value)}
//                                 />
//                             )}
//                         </th>
//                     ))}
//                     <th></th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {data && data.map((item, index) => (
//                     <tr key={item.id || index}>
//                         {columns.map(column => (
//                             <td key={column.key}>
//                                 {column.render ? column.render(item[column.key], item) : item[column.key]}
//                             </td>
//                         ))}
//                         <td>
//                             {onView && (
//                                 <button onClick={() => onView(item)}>Просмотр</button>
//                             )}
//                             {onEdit && (
//                                 <button onClick={() => onEdit(item)}>Редактировать</button>
//                             )}
//                             {onDelete && (
//                                 <button onClick={() => onDelete(item)}>Удалить</button>
//                             )}
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//
//             <Pagination
//                 pageNumber={pageNumber}
//                 pageSize={pageSize}
//                 totalSize={totalSize}
//                 onPageChange={onPageChange}
//             />
//         </div>
//     );
// };
//
// export default DataTable;