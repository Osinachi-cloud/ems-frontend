import { Address } from "@/types/address";
import { AlertTriangle, Loader2, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePost } from "@/hooks/usePost";
import { baseUrL } from "@/env/URLs";
import { Response } from "@/types/reponse";
import { FeedbackMessage } from "../inventory/feedback";
import React from "react";
import { useFetch } from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AddressFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

const initialAddressState: Omit<Address, 'addressId'> = {
    country: '',
    state: '',
    city: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
    postalCode: '',
    fullAddress: '',
    estateId: '',
    userId: '',
};

const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onClose }) => {

    const [address, setAddress] = useState<Omit<Address, 'addressId'>>(initialAddressState);
    const [response, setResponse] = useState<Response | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { getUserDetails } = useLocalStorage("userDetails", null);
    const estateId = getUserDetails()?.estateId;

    const {
        callApi: createAddressApi,
        isLoading: createLoading,
    } = usePost("POST", address, `${baseUrL}/create-address`, null);

    const {
        data: estate,
        callApi: getEstate,
        isLoading: estateLoading,
    } = useFetch("GET", null, `${baseUrL}/get-estate?estateId=${estateId}`);

    useEffect(() => {
        setAddress(initialAddressState);
        setResponse(null);
        setErrors({});
    }, []);

    useEffect(() => {
        if (estate?.data) {
            setAddress(prev => ({
                ...prev,
                country: estate.data.country || '',
                state: estate.data.state || '',
                city: estate.data.city || '',
                estateId: estate.data.estateId || estateId,
            }));
        }
    }, [estate, estateId]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const validateForm = (data: Omit<Address, 'addressId'>) => {
        const newErrors: { [key: string]: string } = {};
        if (!data.street.trim()) newErrors.street = "Street is required.";
        if (!data.houseNumber.trim()) newErrors.houseNumber = "House number is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse(null);

        const validationErrors = validateForm(address);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            // Pass the current address state to the API call
            const apiResponse: any = await createAddressApi();

            if (apiResponse?.success) {
                setResponse({ success: apiResponse.success, message: apiResponse.message });
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setResponse({ success: apiResponse?.success, message: apiResponse?.error || 'Failed to create address.' });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setResponse({ success: false, message: 'An unexpected network error occurred.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {response && <FeedbackMessage success={response.success} message={response.message} />}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                <FormInput
                    label="Country"
                    name="country"
                    value={address.country}
                    handleChange={handleChange}
                    loading={createLoading || estateLoading}
                    compact
                    readOnly
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                    label="State"
                    name="state"
                    value={address.state}
                    handleChange={handleChange}
                    loading={createLoading || estateLoading}
                    compact
                    readOnly
                />
                <FormInput
                    label="City"
                    name="city"
                    value={address.city}
                    handleChange={handleChange}
                    loading={createLoading || estateLoading}
                    compact
                    readOnly
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                    label="Estate"
                    name="estateName"
                    value={estate?.data?.name || ''}
                    handleChange={handleChange}
                    loading={createLoading || estateLoading}
                    compact
                    readOnly
                />
                <FormInput
                    label="Street"
                    name="street"
                    error={errors.street}
                    value={address.street}
                    handleChange={handleChange}
                    loading={createLoading}
                    compact
                />
            </div>
            <FormInput
                label="Description (Optional)"
                name="fullAddress"
                type="textarea"
                value={address.fullAddress}
                handleChange={handleChange}
                loading={createLoading}
                compact
            />
            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed mt-2"
                disabled={createLoading || estateLoading}
            >
                {createLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Address
                    </>
                )}
            </button>
        </form>
    );
};

export default AddressForm;

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    error?: string;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    loading: boolean;
    compact?: boolean;
    readOnly?: boolean;
}

const FormInput: React.FC<FormInputProps> = React.memo(({
    label,
    name,
    type = 'text',
    error,
    value,
    handleChange,
    loading,
    compact = false,
    readOnly = false
}) => {

    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm text-sm ${error ? 'border-red-500' : 'border-gray-300'
        } ${compact ? 'text-sm' : ''} ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    let inputElement;

    if (type === 'textarea') {
        inputElement = (
            <textarea
                id={name}
                name={name}
                rows={2}
                value={value}
                onChange={handleChange}
                className={`${inputClasses} resize-none`}
                disabled={loading || readOnly}
                readOnly={readOnly}
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
                className={inputClasses}
                disabled={loading || readOnly}
                readOnly={readOnly}
            />
        );
    }

    return (
        <div className={`flex flex-col ${compact ? 'space-y-1' : 'space-y-1.5'}`}>
            <label htmlFor={name} className={`font-medium text-gray-700 ${compact ? 'text-xs' : 'text-[12px]'}`}>
                {label}
            </label>
            {inputElement}
            {error && (
                <p className="text-xs text-red-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {error}
                </p>
            )}
        </div>
    );
});

FormInput.displayName = 'FormInput';