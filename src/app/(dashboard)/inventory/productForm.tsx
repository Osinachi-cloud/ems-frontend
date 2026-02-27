

// import { Product } from "@/types/product";
// import { AlertTriangle, Edit, Loader2, PlusCircle } from "lucide-react";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import  FormInput  from "./formInput";
// import { usePost } from "@/hooks/usePost";
// import { baseUrL } from "@/env/URLs";
// import { Response } from "@/types/reponse";
// import { FeedbackMessage } from "./feedback";
// import React from "react";

// interface ProductFormProps {
//     onSuccess: () => void;
//     onClose: () => void;
//     initialProduct?: Product; 
// }

// const designationOptions = [
//     { value: 'TENANT', label: 'TENANT' },
//     { value: 'LANDLORD', label: 'LANDLORD' },
// ];

// const initialProductState: Omit<Product, 'productId' | 'estate' | 'productImage'> = {
//     name: '',
//     description: '',
//     code: '',
//     price: 0,
//     designation: '',
//     publishStatus: false,
//     transactionCharge: 0,
    
// };

// const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onClose, initialProduct}) => {

//     const cleanInitialProduct = initialProduct ? (({ productId, productImage, ...rest }) => rest)(initialProduct) : initialProductState;
//     const [product, setProduct] = useState<Omit<Product, 'productId' | 'estate' | 'productImage'>>(cleanInitialProduct);
//     const [response, setResponse] = useState<Response | null>(null);
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});

//     const isEditMode = !!initialProduct;
//     const submitButtonText = isEditMode ? 'Save Changes' : 'Submit Product';

//     const fullProduct: Product = useMemo(() => ({ 
//         ...product, 
//         productId: initialProduct?.productId || '', 
//         productImage: initialProduct?.productImage || null,
//     }), [product, initialProduct]);
    
//     const { 
//         callApi: createProductApi, 
//         isLoading: createLoading 
//     } = usePost("POST", product, `${baseUrL}/create-product`, null); 
    
//     const { 
//         callApi: updateProductApi, 
//         isLoading: updateLoading 
//     } = usePost("PUT", fullProduct, `${baseUrL}/update-product`, null); 

//     const loading = createLoading || updateLoading;

//     useEffect(() => {
//         setProduct(cleanInitialProduct);
//         setResponse(null);
//         setErrors({});
//     }, [initialProduct]);


//     const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         setProduct(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
//                     (name === 'price' || name === 'transactionCharge') ? parseFloat(value) : value,
//         }));
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     }, [errors]);

//     const validateForm = (data: Omit<Product, 'productId' | 'estate' | 'productImage'>) => {
//         const newErrors: { [key: string]: string } = {};
//         if (!data.name.trim()) newErrors.name = "Product name is required.";
//         if (!data.code.trim()) newErrors.code = "Product code is required.";
//         if (data.price === null || isNaN(data.price as number) || (data.price as number) < 0) newErrors.price = "Price must be a non-negative number.";
//         if (data.transactionCharge === null || isNaN(data.transactionCharge as number) || (data.transactionCharge as number) < 0) newErrors.transactionCharge = "Transaction charge must be a non-negative number.";
//         if (!data.designation.trim()) newErrors.designation = "Designation is required.";
//         return newErrors;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setResponse(null);

//         const validationErrors = validateForm(product);
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         setErrors({});

//         try {
//             let apiResponse: any;

//             if (isEditMode && initialProduct) {
//                 apiResponse = await updateProductApi(); 
//             } else {
//                 apiResponse = await createProductApi();
//             }

//             if (apiResponse?.success) {
//                 setResponse({ success: apiResponse.success, message: apiResponse.message });
                
//                 setTimeout(() => {
//                     onSuccess(); 
//                 }, 1000); 
//             } else {
//                 setResponse({ success: apiResponse.success, message: apiResponse?.error || `Failed to ${isEditMode ? 'update' : 'create'} product.` });
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//             setResponse({ success: false, message: 'An unexpected network error occurred.' });
//         }
//     };
    
//     return (
//         <form onSubmit={handleSubmit} className="space-y-3">
//             {response && <FeedbackMessage success={response.success} message={response.message} />}

//             {/* Compact grid layout */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <FormInput
//                     label="Product Name"
//                     name="name"
//                     error={errors.name}
//                     product={product} 
//                     handleChange={handleChange} 
//                     loading={loading} 
//                     compact
//                 />
//                 <FormInput
//                     label="Product Code"
//                     name="code"
//                     error={errors.code}
//                     product={product} 
//                     handleChange={handleChange} 
//                     loading={loading} 
//                     compact
//                 />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 <FormInput
//                     label="Price"
//                     name="price"
//                     type="number"
//                     error={errors.price}
//                     product={product} 
//                     handleChange={handleChange} 
//                     loading={loading} 
//                     compact
//                 />
//                 <FormInput
//                     label="Transaction Charge"
//                     name="transactionCharge"
//                     type="number"
//                     error={errors.transactionCharge}
//                     product={product} 
//                     handleChange={handleChange} 
//                     loading={loading} 
//                     compact
//                 />
//             </div>

//             <FormInput
//                 label="Designation Role"
//                 name="designation"
//                 options={designationOptions}
//                 error={errors.designation}
//                 product={product} 
//                 handleChange={handleChange} 
//                 loading={loading} 
//                 compact
//             />
            
//             {/* Compact Publish Status */}
//             <div className="flex items-center space-x-2 py-1">
//                 <input
//                     id="publishStatus"
//                     name="publishStatus"
//                     type="checkbox"
//                     checked={product.publishStatus}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
//                 />
//                 <label htmlFor="publishStatus" className="text-sm text-gray-700">
//                     Publish Product
//                 </label>
//             </div>
//             {errors.publishStatus && (
//                 <p className="text-xs text-red-500 flex items-center mt-1">
//                     <AlertTriangle className="w-3 h-3 mr-1" />
//                     {errors.publishStatus}
//                 </p>
//             )}

//             <FormInput
//                 label="Description"
//                 name="description"
//                 type="textarea"
//                 error={errors.description}
//                 product={product} 
//                 handleChange={handleChange} 
//                 loading={loading} 
//                 compact
//             />

//             <button
//                 type="submit"
//                 className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed mt-2"
//                 disabled={loading}
//             >
//                 {loading ? (
//                     <>
//                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         {isEditMode ? 'Saving...' : 'Creating...'}
//                     </>
//                 ) : (
//                     <>
//                         {isEditMode ? <Edit className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
//                         {submitButtonText}
//                     </>
//                 )}
//             </button>
//         </form>
//     );
// };

// export default ProductForm
















// interface FormInputProps {
//     label: string;
//     name: keyof Omit<Product, 'productId' | 'estate' | 'productImage'>;
//     type?: string;
//     error?: string;
//     options?: { value: string; label: string }[];
//     product: Omit<Product, 'productId' | 'estate' | 'productImage'>;
//     handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//     loading: boolean;
//     compact?: boolean;
// }

// const FormInput: React.FC<FormInputProps> = React.memo(({ 
//     label, 
//     name, 
//     type = 'text', 
//     error, 
//     options, 
//     product, 
//     handleChange, 
//     loading,
//     compact = false 
// }) => {
    
//     const inputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 shadow-sm text-sm ${
//         error ? 'border-red-500' : 'border-gray-300'
//     } ${compact ? 'text-sm' : ''}`;
    
//     const value = product[name] as any;

//     let inputElement;

//     if (options) {
//         inputElement = (
//             <select
//                 id={name}
//                 name={name}
//                 value={value}
//                 onChange={handleChange}
//                 className={`${inputClasses} appearance-none`}
//                 disabled={loading}
//             >
//                 <option value="" disabled>Select Designation Role</option>
//                 {options.map((option) => (
//                     <option key={option.value} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//             </select>
//         );
//     } else if (type === 'textarea') {
//         inputElement = (
//             <textarea
//                 id={name}
//                 name={name}
//                 rows={2}
//                 value={value}
//                 onChange={handleChange}
//                 className={`${inputClasses} resize-none`}
//                 disabled={loading}
//             />
//         );
//     } else {
//         inputElement = (
//             <input
//                 id={name}
//                 name={name}
//                 type={type}
//                 value={value}
//                 onChange={handleChange}
//                 step={type === 'number' ? "0.01" : undefined}
//                 className={inputClasses}
//                 disabled={loading}
//             />
//         );
//     }

//     return (
//         <div className={`flex  flex-col ${compact ? 'space-y-1' : 'space-y-1.5'}`}>
//             <label htmlFor={name} className={`font-medium text-gray-700 ${compact ? 'text-xs' : 'text-[12px]'}`}>
//                 {label}
//             </label>
//             {inputElement}
//             {error && (
//                 <p className="text-xs text-red-500 flex items-center">
//                     <AlertTriangle className="w-3 h-3 mr-1" />
//                     {error}
//                 </p>
//             )}
//         </div>
//     );
// });

// export default FormInput;