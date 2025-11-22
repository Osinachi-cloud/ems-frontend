
import { Product } from "@/types/product";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface FormInputProps {
    label: string;
    name: keyof Omit<Product, 'productId' | 'estate' | 'productImage'>;
    type?: string;
    error?: string;
    options?: { value: string; label: string }[];
    product: Omit<Product, 'productId' | 'estate' | 'productImage'>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    loading: boolean;
    compact?: boolean;
}

export const FormInput: React.FC<FormInputProps> = React.memo(({ 
    label, 
    name, 
    type = 'text', 
    error, 
    options, 
    product, 
    handleChange, 
    loading,
    compact = false 
}) => {
    
    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 shadow-sm text-sm ${
        error ? 'border-red-500' : 'border-gray-300'
    } ${compact ? 'text-sm' : ''}`;
    
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
        <div className={`flex  flex-col ${compact ? 'space-y-1' : 'space-y-1.5'}`}>
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