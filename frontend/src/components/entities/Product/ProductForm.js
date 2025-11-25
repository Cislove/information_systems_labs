// import React, { useState, useEffect } from 'react';
// import { useApi } from '../../../hooks/useApi.js';
// import { personService, organizationService} from '../../../services/api.js';
//
// const ProductForm = ({ product, onSubmit, onCancel }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         price: '',
//         manufactureCost: '',
//         rating: '',
//         partNumber: '',
//         unitOfMeasure: '',
//         coordinates: null,
//         organization: null,
//         person: null
//     });
//
//     const { data: persons } = useApi(personService.getAll);
//     const { data: organizations } = useApi(organizationService.getAll);
//     const { data: coordinates } = useApi(coordinatesService.getAll);
//
//     useEffect(() => {
//         if (product) {
//             setFormData({
//                 name: product.name || '',
//                 price: product.price || '',
//                 manufactureCost: product.manufactureCost || '',
//                 rating: product.rating || '',
//                 partNumber: product.partNumber || '',
//                 unitOfMeasure: product.unitOfMeasure || '',
//                 coordinates: product.coordinates || null,
//                 organization: product.organization || null,
//                 person: product.person || null
//             });
//         }
//     }, [product]);
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };
//
//     const handleChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };
//
//     return (
//         <form onSubmit={handleSubmit} className="product-form">
//             <div className="form-group">
//                 <label>Название:</label>
//                 <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => handleChange('name', e.target.value)}
//                     required
//                 />
//             </div>
//
//             <div className="form-group">
//                 <label>Цена:</label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={formData.price}
//                     onChange={(e) => handleChange('price', parseFloat(e.target.value))}
//                     required
//                 />
//             </div>
//
//             <div className="form-group">
//                 <label>Рейтинг:</label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={formData.rating}
//                     onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
//                 />
//             </div>
//
//             <div className="form-group">
//                 <label>Единица измерения:</label>
//                 <select
//                     value={formData.unitOfMeasure}
//                     onChange={(e) => handleChange('unitOfMeasure', e.target.value)}
//                 >
//                     <option value="">Выберите...</option>
//                     <option value="METERS">Метры</option>
//                     <option value="CENTIMETERS">Сантиметры</option>
//                     <option value="LITERS">Литры</option>
//                     <option value="GRAMS">Граммы</option>
//                     <option value="MILLIGRAMS">Миллиграммы</option>
//                 </select>
//             </div>
//
//             <div className="form-group">
//                 <label>Организация:</label>
//                 <select
//                     value={formData.organization?.id || ''}
//                     onChange={(e) => handleChange('organization',
//                         organizations?.content?.find(org => org.id === parseInt(e.target.value)) || null
//                     )}
//                 >
//                     <option value="">Выберите организацию</option>
//                     {organizations?.content?.map(org => (
//                         <option key={org.id} value={org.id}>
//                             {org.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//
//             <div className="form-group">
//                 <label>Координаты:</label>
//                 <select
//                     value={formData.coordinates?.id || ''}
//                     onChange={(e) => handleChange('coordinates',
//                         coordinates?.content?.find(coord => coord.id === parseInt(e.target.value)) || null
//                     )}
//                 >
//                     <option value="">Выберите координаты</option>
//                     {coordinates?.content?.map(coord => (
//                         <option key={coord.id} value={coord.id}>
//                             ({coord.x}, {coord.y})
//                         </option>
//                     ))}
//                 </select>
//             </div>
//
//             <div className="form-actions">
//                 <button type="submit">Сохранить</button>
//                 <button type="button" onClick={onCancel}>Отмена</button>
//             </div>
//         </form>
//     );
// };
//
// export default ProductForm;