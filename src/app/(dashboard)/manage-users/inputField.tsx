import { InputFieldProps } from "@/types/reponse";
import { AlertTriangle } from "lucide-react";
import React from "react";

const InputField: React.FC<InputFieldProps> = React.memo(({ name, label, type = 'text', error, value, onChange, disabled }) => {

    const inputClasses = `w-full px-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 shadow-sm ${error ? 'border-red-500' : 'border-gray-300'}`;

    let inputElement;

    if (type === 'checkbox') {
        inputElement = (
            <div className="flex items-center mt-1">
                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    checked={value as boolean}
                    onChange={onChange}
                    className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    disabled={disabled}
                />
                <label htmlFor={name} className="ml-3 text-sm text-gray-900 font-semibold">
                    {value ? 'Active (User is enabled)' : 'Inactive (User is disabled)'}
                </label>
            </div>
        );
    } else {
        inputElement = (
            <input
                id={name}
                name={name}
                type={type}
                value={value as string | number}
                onChange={onChange}
                className={inputClasses}
                disabled={disabled}
            />
        );
    }

    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={name} className="text-[12px] font-medium text-gray-700">{label}</label>
            {inputElement}
            {error && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{error}</p>}
        </div>
    );
});

export default InputField;