// import React from 'react';
// import DataTable from '../../common/DataTable.js';
//
// const ProductTable = ({
//                           products,
//                           onEdit,
//                           onDelete,
//                           onView,
//                           pagination,
//                           onPageChange,
//                           onSort,
//                           onFilter
//                       }) => {
//     const columns = [
//         {
//             key: 'id',
//             title: 'ID',
//             filterable: true
//         },
//         {
//             key: 'name',
//             title: 'Название',
//             filterable: true
//         },
//         {
//             key: 'price',
//             title: 'Цена',
//             render: (value) => `$${value?.toFixed(2) || '0.00'}`
//         },
//         {
//             key: 'rating',
//             title: 'Рейтинг',
//             render: (value) => value?.toFixed(2) || '0.00'
//         },
//         {
//             key: 'unitOfMeasure',
//             title: 'Единица измерения'
//         },
//         {
//             key: 'organization',
//             title: 'Организация',
//             render: (value) => value?.name || '-'
//         },
//         {
//             key: 'creationDate',
//             title: 'Дата создания',
//             render: (value) => new Date(value).toLocaleDateString()
//         }
//     ];
//
//     return (
//         <DataTable
//             data={products}
//             columns={columns}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onView={onView}
//             {...pagination}
//             onPageChange={onPageChange}
//             onSort={onSort}
//             onFilter={onFilter}
//         />
//     );
// };
//
// export default ProductTable;