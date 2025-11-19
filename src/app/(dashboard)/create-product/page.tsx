"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PlusCircle, Loader2, CheckCircle, AlertTriangle, X, Package, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { usePost } from '@/hooks/usePost'; 

const baseUrL = "http://localhost:8091/api/v1";

interface Estate {
    id: number;
    name: string;
}

interface Product {
    productId: string | number; // Updated to handle number or string from API
    name: string;
    description: string;
    code: string | null;
    price: number | null; // Price can be null
    designation: string;
    productImage?: string | null;
    estate: Estate | null;
}

interface BaseResponse<T> {
    message: string;
    statusCode: number;
    error: string | null;
    timestamp: string;
    data: T;
}

// **FIXED INTERFACE:** Reflects the actual nested structure of your API response
interface NestedProductsFetchResponse {
    data: Product[];
    page: number; // Current page index (e.g., 0)
    size: number;
    total: number; // Total number of records (e.g., 2)
}

// NOTE: Since external formatNumberToNaira is not available, we use a simple local version for display
const formatNumberToNaira = (num: number | null) => {
    if (num === null || isNaN(num)) return 'N/A';
    // Format the number assuming it's in Naira (NGN)
    return num.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 });
};

const ITEMS_PER_PAGE = 5; // Fixed items per page for frontend pagination display

const designationOptions = [
    { value: 'TENANT', label: 'TENANT' },
    { value: 'LANDLORD', label: 'LANDLORD' },
];

// --- 3. Product Creation/Edit Form Component ---

const initialProductState: Omit<Product, 'productId' | 'estate' | 'productImage'> = {
    name: '',
    description: '',
    code: '',
    price: 0,
    designation: '',
};

interface FormInputProps {
    label: string;
    name: keyof Omit<Product, 'productId' | 'estate' | 'productImage'>;
    type?: string;
    error?: string;
    options?: { value: string; label: string }[];
    product: Omit<Product, 'productId' | 'estate' | 'productImage'>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    loading: boolean;
}

const FormInput: React.FC<FormInputProps> = React.memo(({ label, name, type = 'text', error, options, product, handleChange, loading }) => {
    
    const inputClasses = `w-full px-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 shadow-sm ${error ? 'border-red-500' : 'border-gray-300'}`;
    const value = product[name] as any;

    let inputElement;

    if (options) {
        inputElement = (
            <select
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className={`${inputClasses} appearance-none`}
                disabled={loading}
            >
                <option value="" disabled>Select Designation Role</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    } else if (type === 'textarea') {
        inputElement = (
            <textarea
                id={name}
                name={name}
                rows={2}
                value={value}
                onChange={handleChange}
                className={`${inputClasses} resize-none`}
                disabled={loading}
            />
        );
    } else {
        inputElement = (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                step={type === 'number' ? "0.01" : undefined}
                className={inputClasses}
                disabled={loading}
            />
        );
    }

    return (
        <div className="flex flex-col space-y-1 ">
            <label htmlFor={name} className="text-[12px] font-medium text-gray-700">{label}</label>
            {inputElement}
            {error && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{error}</p>}
        </div>
    );
});

interface ProductFormProps {
    onSuccess: () => void;
    onClose: () => void;
    initialProduct?: Product; 
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onClose, initialProduct }:any) => {

    // Filter out fields not present in the simplified initial state
    const cleanInitialProduct = initialProduct ? (({ productId, estate, productImage, ...rest }) => rest)(initialProduct) : initialProductState;

    const [product, setProduct] = useState<Omit<Product, 'productId' | 'estate' | 'productImage'>>(cleanInitialProduct);
    const [response, setResponse] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const isEditMode = !!initialProduct;
    const submitButtonText = isEditMode ? 'Save Changes' : 'Submit Product';

    // Body preparation for POST/PUT hooks (using useMemo to stabilize the object for hooks)
    const fullProduct: Product = useMemo(() => ({ 
        ...product, 
        productId: initialProduct?.productId || '', 
        estate: initialProduct?.estate || null,
        productImage: initialProduct?.productImage || null,
    }), [product, initialProduct]);
    
    // Hook for Creation (POST: body = product state)
    const { 
        callApi: createProductApi, 
        isLoading: createLoading 
    // @ts-ignore - Assuming usePost is correctly imported externally
    } = usePost("POST", product, `${baseUrL}/create-product`, null); 
    
    // Hook for Update (PUT: body = fullProduct state)
    const { 
        callApi: updateProductApi, 
        isLoading: updateLoading 
    // @ts-ignore - Assuming usePost is correctly imported externally
    } = usePost("PUT", fullProduct, `${baseUrL}/update-product`, null); 

    const loading = createLoading || updateLoading;

    useEffect(() => {
        setProduct(cleanInitialProduct);
        setResponse({ type: null, message: '' });
        setErrors({});
    }, [initialProduct]);


    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const validateForm = (data: Omit<Product, 'productId' | 'estate' | 'productImage'>) => {
        const newErrors: { [key: string]: string } = {};
        if (!data.name.trim()) newErrors.name = "Product name is required.";
        // if (!data.code.trim()) newErrors.code = "Product code is required.";
        // Price check handles null/NaN/negative
        if (data.price === null || isNaN(data.price as number) || (data.price as number) < 0) newErrors.price = "Price must be a non-negative number.";
        if (!data.designation.trim()) newErrors.designation = "Designation is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse({ type: null, message: '' });

        const validationErrors = validateForm(product);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            let apiResponse: any;

            if (isEditMode && initialProduct) {
                // Call PUT hook which has closed over the 'fullProduct' state via usePost definition
                apiResponse = await updateProductApi(); 
            } else {
                // Call POST hook which has closed over the 'product' state via usePost definition
                apiResponse = await createProductApi();
            }

            if (apiResponse?.success) {
                setResponse({ type: 'success', message: apiResponse.message });
                
                setTimeout(() => {
                    onSuccess(); // Triggers table refresh and modal close
                }, 1000); 
            } else {
                setResponse({ type: 'error', message: apiResponse?.message || `Failed to ${isEditMode ? 'update' : 'create'} product.` });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setResponse({ type: 'error', message: 'An unexpected network error occurred.' });
        }
    };

    const FeedbackMessage: React.FC<{ type: 'success' | 'error'; message: string }> = ({ type, message }) => (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md mb-6`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="font-medium text-sm">{message}</p>
        </div>
    );
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {response.type && <FeedbackMessage type={response.type} message={response.message} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                    label="Product Name"
                    name="name"
                    error={errors.name}
                    product={product} 
                    handleChange={handleChange} 
                    loading={loading} 
                />
                <FormInput
                    label="Product Code"
                    name="code"
                    error={errors.code}
                    product={product} 
                    handleChange={handleChange} 
                    loading={loading} 
                />
            </div>

            <FormInput
                label="Designation Role"
                name="designation"
                options={designationOptions}
                error={errors.designation}
                product={product} 
                handleChange={handleChange} 
                loading={loading} 
            />
            
            <FormInput
                label="Price (Min 0)"
                name="price"
                type="number"
                error={errors.price}
                product={product} 
                handleChange={handleChange} 
                loading={loading} 
            />

            <FormInput
                label="Description"
                name="description"
                type="textarea"
                error={errors.description}
                product={product} 
                handleChange={handleChange} 
                loading={loading} 
            />

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {isEditMode ? 'Saving Changes...' : 'Creating Product...'}
                    </>
                ) : (
                    <>
                        {isEditMode ? <Edit className="w-5 h-5 mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
                        {submitButtonText}
                    </>
                )}
            </button>
        </form>
    );
};

// --- 4. Main Inventory Page Component ---


const InventoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined); 

    // **FIXED PAGINATION URL:** Pass page index + 1 (as page numbers usually start at 1 for API requests)
    const fetchUrl = `${baseUrL}/get-products?page=${currentPage - 1}&size=${ITEMS_PER_PAGE}`;
    
    // @ts-ignore - Assuming useFetch is correctly imported externally
    const {
        data: productsResponse,
        isLoading: productsLoading,
        error: productsError,
        callApi: refetchproducts
    } = useFetch("GET", null, fetchUrl); // Dependency on fetchUrl ensures refetch on page change

    // **FIXED DATA EXTRACTION:** Adjusting to the nested structure productsResponse.data.data
    const paginatedProducts = productsResponse?.data?.data || [];
    // **FIXED TOTAL PAGES CALCULATION:** Use Math.ceil(total / itemsPerPage)
    const productCount = productsResponse?.data?.total || 0;
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE) || 1;


    // --- Callbacks ---
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

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // --- Modal Component ---
    const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => {
        const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };

        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }, [onClose]);

        if (!isModalOpen) return null;

        return (
            <div 
                className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative">
                    <div className="p-6 sm:p-8 pb-3 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="p-6 sm:p-8 pt-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

  
    const PaginationControls: React.FC = () => {
        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, productCount);
        
        // Only render if we have data AND more pages than 1.
        if (productsLoading || productCount === 0) return null;
        if (productCount <= ITEMS_PER_PAGE && totalPages <= 1) return null; 

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white rounded-xl shadow-md border-t border-gray-100">
                {/* Info */}
                <p className="text-sm text-gray-700 mb-3 sm:mb-0">
                    Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{productCount}</span> products
                </p>

                {/* Controls */}
                <div className="flex space-x-1">
                    {/* Previous Button */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1 mx-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => goToPage(index + 1)}
                                className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === index + 1
                                    ? 'bg-teal-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                aria-label={`Go to page ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
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

            {/* Product Table */}
            {!productsLoading && !productsError && (
                <>
                    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden sm:table-header-group">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Description</th>
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
                                            ₦{formatNumberToNaira(product.price)}
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
                                        <td colSpan={6} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
                                            {productCount === 0 ? "No products defined yet. Click \"Add Product\" to begin." : "No products found on this page."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <PaginationControls />
                </>
            )}

            {/* Product Creation/Edit Modal */}
            <Modal
                onClose={closeModal}
                title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
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