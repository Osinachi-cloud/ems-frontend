"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusCircle, Loader2, Package, Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PaginationControls } from './pagination';
import { Modal } from './modal';
// import { ProductForm } from './productForm';
import { Product } from '@/types/product';
import { baseUrL } from '@/env/URLs';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';
import { usePost } from '@/hooks/usePost';
import { Response } from "@/types/reponse";
import ProductForm from './productForm';

const ITEMS_PER_PAGE = 5;

const InventoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined); 

    const fetchUrl = `${baseUrL}/get-products?page=${currentPage - 1}&size=${ITEMS_PER_PAGE}`;
    
    const {
        data: productsResponse,
        isLoading: productsLoading,
        error: productsError,
        callApi: refetchproducts
    } = useFetch("GET", null, fetchUrl);

    const paginatedProducts = productsResponse?.data?.data || [];
    const productCount = productsResponse?.data?.total || 0;
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE) || 1;

    const handleProductSuccess = () => {
        refetchproducts();
        setEditingProduct(undefined);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(undefined); 
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

            {/* Page Header and Action */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-teal-600" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Product Inventory</h1>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-teal-600 text-white font-bold text-sm rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
                >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Loading/Error State */}
            {productsLoading && (
                <div className="text-center py-10 text-teal-600">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                    <p className="font-semibold">Loading products...</p>
                </div>
            )}
            {productsError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    <p className="font-semibold">Error fetching products: {productsError}</p>
                    <button onClick={() => refetchproducts()} className="text-sm underline mt-2">Try Again</button>
                </div>
            )}

            {!productsLoading && !productsError && (
                <>
                    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden sm:table-header-group">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Transaction Charge</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Publish Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedProducts.map((product: Product) => (
                                    <tr
                                        key={product.productId}
                                        className="block sm:table-row hover:bg-teal-50 transition duration-150 border-b"
                                    >
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell whitespace-normal text-gray-900">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Product Name:</span>
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-500 font-mono">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Code:</span>
                                            {product.code || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm font-bold text-green-600">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Price:</span>
                                            {formatNumberToNaira(product.price)}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm font-bold text-blue-600">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Transaction Charge:</span>
                                            {formatNumberToNaira(product.transactionCharge)}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Publish Status:</span>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.publishStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.publishStatus ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Role:</span>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.designation === 'TENANT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {product.designation}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 hidden sm:table-cell text-sm text-gray-600 max-w-xs truncate">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Description:</span>
                                            {product.description || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell text-right sm:text-right text-sm font-medium">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Actions:</span>
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
                                                aria-label={`Edit ${product.name}`}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
                                            {productCount === 0 ? "No products defined yet. Click \"Add Product\" to begin." : "No products found on this page."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <PaginationControls 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        itemsPerPage={ITEMS_PER_PAGE}
                        recordCount={productCount}
                        totalPages={totalPages}
                        responseLoading={productsLoading}
                    />
                </>
            )}

            <Modal
                onClose={closeModal}
                title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                isModalOpen={isModalOpen}
            >
                <ProductForm
                    onSuccess={handleProductSuccess}
                    onClose={closeModal}
                    initialProduct={editingProduct}
                />
            </Modal>
        </div>
    );
};

export default InventoryPage;










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

// // export default ProductForm
















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





// export const FeedbackMessage: React.FC<Response> = ({ success, message }) => (
//     <>
//     {
//         console.log("success | message", success, message)
//     }
//     <div className={`p-4 rounded-lg flex items-center space-x-3 ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md mb-4`}>
//         {success ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
//         <p className="font-medium text-sm">{message}</p>
//     </div>
//     </>
// );