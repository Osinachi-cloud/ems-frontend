import { Product } from "@/types/product";
import { AlertTriangle, CheckCircle, Edit, Loader2, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormInput } from "./formInput";
import { usePost } from "@/hooks/usePost";
import { baseUrL } from "@/env/URLs";
import { Response } from "@/types/reponse";
import { FeedbackMessage } from "./feedback";

interface ProductFormProps {
    onSuccess: () => void;
    onClose: () => void;
    initialProduct?: Product; 
}

const designationOptions = [
    { value: 'TENANT', label: 'TENANT' },
    { value: 'LANDLORD', label: 'LANDLORD' },
];

const initialProductState: Omit<Product, 'productId' | 'estate' | 'productImage'> = {
    name: '',
    description: '',
    code: '',
    price: 0,
    designation: '',
};

export const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onClose, initialProduct}) => {

    const cleanInitialProduct = initialProduct ? (({ productId, productImage, ...rest }) => rest)(initialProduct) : initialProductState;
    const [product, setProduct] = useState<Omit<Product, 'productId' | 'estate' | 'productImage'>>(cleanInitialProduct);
    const [response, setResponse] = useState<Response | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const isEditMode = !!initialProduct;
    const submitButtonText = isEditMode ? 'Save Changes' : 'Submit Product';

    const fullProduct: Product = useMemo(() => ({ 
        ...product, 
        productId: initialProduct?.productId || '', 
        productImage: initialProduct?.productImage || null,
    }), [product, initialProduct]);
    
    const { 
        callApi: createProductApi, 
        isLoading: createLoading 
    } = usePost("POST", product, `${baseUrL}/create-product`, null); 
    
    const { 
        callApi: updateProductApi, 
        isLoading: updateLoading 
    } = usePost("PUT", fullProduct, `${baseUrL}/update-product`, null); 

    const loading = createLoading || updateLoading;

    useEffect(() => {
        setProduct(cleanInitialProduct);
        setResponse(null);
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
        if (!data.code.trim()) newErrors.code = "Product code is required.";
        if (data.price === null || isNaN(data.price as number) || (data.price as number) < 0) newErrors.price = "Price must be a non-negative number.";
        if (!data.designation.trim()) newErrors.designation = "Designation is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse(null);

        const validationErrors = validateForm(product);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            let apiResponse: any;

            if (isEditMode && initialProduct) {
                apiResponse = await updateProductApi(); 
            } else {
                apiResponse = await createProductApi();
            }

            console.log("apiResponse 1====>", apiResponse); // This should have your data


            if (apiResponse?.success) {
                setResponse({ success: apiResponse.success, message: apiResponse.message });
                
                setTimeout(() => {
                    onSuccess(); 
                }, 1000); 
            } else {
                setResponse({ success: apiResponse.success, message: apiResponse?.error || `Failed to ${isEditMode ? 'update' : 'create'} product.` });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setResponse({ success: false, message: 'An unexpected network error occurred.' });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {response && <FeedbackMessage success={response.success} message={response.message} />}

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