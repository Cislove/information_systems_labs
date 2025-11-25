// import axios from 'axios';
//
// const API_BASE_URL = 'http://localhost:8080/api/v1';
//
// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
//
// // Entity services
// export const productService = {
//     getAll: (pageNumber = 0, size = 10) =>
//         api.get('/product', { params: { pageNumber, size } }),
//
//     getById: (id) => api.get(`/product/${id}`),
//
//     create: (productData) => api.post('/product', productData),
//
//     update: (productData) => api.put('/product', productData),
//
//     delete: (id) => api.delete(`/product/${id}`),
//
//     search: (field, value, pageNumber = 0, size = 10) =>
//         api.get('/product/search', { params: { field, value, pageNumber, size } }),
// };
//
// export const personService = {
//     getAll: (pageNumber = 0, size = 10) =>
//         api.get('/person', { params: { pageNumber, size } }),
//
//     getById: (id) => api.get(`/person/${id}`),
//
//     create: (personData) => api.post('/person', personData),
//
//     update: (personData) => api.put('/person', personData),
//
//     delete: (id) => api.delete(`/person/${id}`),
//
//     search: (field, value, pageNumber = 0, size = 10) =>
//         api.get('/person/search', { params: { field, value, pageNumber, size } }),
// };
//
// export const organizationService = {
//     getAll: (pageNumber = 0, size = 10) =>
//         api.get('/organization', { params: { pageNumber, size } }),
//
//     getById: (id) => api.get(`/organization/${id}`),
//
//     create: (organizationData) => api.post('/organization', organizationData),
//
//     update: (organizationData) => api.put('/organization', organizationData),
//
//     delete: (id) => api.delete(`/organization/${id}`),
//
//     search: (field, value, pageNumber = 0, size = 10) =>
//         api.get('/organization/search', { params: { field, value, pageNumber, size } }),
// };
//
// // Product operations
// export const productOperationsService = {
//     reducePrice: (percent) =>
//         api.post('/product/price/reduce', { percent }),
//
//     getRatingSum: () => api.get('/product/rating/sum'),
//
//     getRatingCountOfGroups: () => api.get('/product/rating/countOfGroups'),
//
//     getRatingCountGreaterThan: (rating) =>
//         api.get(`/product/rating/countOfProductWhereRatingGreaterThan/${rating}`),
//
//     getProductsByUnitOfMeasure: (unitOfMeasures) =>
//         api.get('/product/unitOfMeasure/productWhereUnitOfMeasureIsSet', {
//             data: unitOfMeasures
//         }),
// };
//
// export default api;