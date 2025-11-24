import { baseUrL } from "@/env/URLs";
import { usePost } from "@/hooks/usePost";
import { Response, UserDto } from "@/types/reponse";
import { AlertTriangle, CheckCircle, Edit, Loader2, ChevronDown } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { InputField } from "./inputField";
import { FeedbackMessage } from "../inventory/feedback";
import { useFetch } from "@/hooks/useFetch";

interface UserFormProps {
    onSuccess: () => void;
    onClose: () => void;
    initialUser: UserDto;
}

export const UserEditForm: React.FC<UserFormProps> = ({ onSuccess, onClose, initialUser }) => {
    const [user, setUser] = useState<{ firstName: string, lastName: string, enabled: boolean, role: string }>({
        firstName: initialUser.firstName || '',
        lastName: initialUser.lastName || '',
        role: initialUser.role?.name || '',
        enabled: initialUser.enabled,
    });

    const [response, setResponse] = useState<Response | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const userUpdateBody = useMemo(() => ({
        ...user,
    }), [user]);

    const {
        data: updateResponse,
        callApi: updateUserApi,
        isLoading: updateLoading
    } = usePost("PUT", userUpdateBody, `${baseUrL}/update-user?email=${initialUser.email}`, null);

    const {
        data: roles,
        callApi: fetchRoles,
        isLoading: roleLoading
    } = useFetch("GET", null, `${baseUrL}/roles?page=0&page=1000`);

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked }: any = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name as keyof typeof user]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleRoleSelect = (roleName: string) => {
        setUser(prev => ({
            ...prev,
            role: roleName,
        }));
        setIsDropdownOpen(false);
        if (errors.role) {
            setErrors(prev => ({ ...prev, role: '' }));
        }
    };

    const validateForm = (data: typeof user) => {
        const newErrors: { [key: string]: string } = {};
        if (!data.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!data.lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!data.role.trim()) newErrors.role = "Role is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse(null);

        const validationErrors = validateForm(user);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            const apiResponse: any = await updateUserApi();

            console.log("apiResponse ====>", apiResponse);

            if (apiResponse?.statusCode === 200 || apiResponse?.success) {
                setResponse({
                    success: true,
                    message: apiResponse.message || "User updated successfully.",
                    data: apiResponse
                });

                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setResponse({
                    success: false,
                    message: apiResponse?.error || `Failed to update user.`,
                    data: apiResponse
                });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setResponse({
                success: false,
                message: error || 'An unexpected network error occurred.'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {response && <FeedbackMessage success={response.success} message={response.message} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="firstName"
                    label="First Name"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                    disabled={updateLoading}
                />
                <InputField
                    name="lastName"
                    label="Last Name"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                    disabled={updateLoading}
                />
            </div>

            {/* Compact Role Dropdown */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Role
                </label>
                <div className="relative">
                    <button
                        type="button"
                        className={`w-full px-3 py-2 text-left bg-white border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 ${
                            errors.role 
                                ? 'border-red-300' 
                                : 'border-gray-300'
                        } ${updateLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => !updateLoading && setIsDropdownOpen(!isDropdownOpen)}
                        disabled={updateLoading}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`${user.role ? 'text-gray-900' : 'text-gray-500'}`}>
                                {user.role || "Select role"}
                            </span>
                            <ChevronDown 
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                    isDropdownOpen ? 'transform rotate-180' : ''
                                }`}
                            />
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                            {roleLoading ? (
                                <div className="flex items-center justify-center py-2 px-3">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-teal-600" />
                                    <span className="text-sm text-gray-500">Loading...</span>
                                </div>
                            ) : roles?.data?.data?.length > 0 ? (
                                roles.data.data.map((r: any) => (
                                    <div
                                        key={r.id}
                                        className={`px-3 py-2 cursor-pointer text-sm transition-colors duration-150 ${
                                            user.role === r.name
                                                ? 'bg-teal-50 text-teal-900'
                                                : 'hover:bg-gray-50 text-gray-900'
                                        }`}
                                        onClick={() => handleRoleSelect(r.name)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{r.name}</span>
                                            {user.role === r.name && (
                                                <CheckCircle className="w-4 h-4 text-teal-600" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-gray-500 text-sm text-center">
                                    No roles available
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {errors.role && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {errors.role}
                    </p>
                )}
            </div>

            {/* Compact Account Status */}
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <input
                    type="checkbox"
                    name="enabled"
                    checked={user.enabled}
                    onChange={handleChange}
                    disabled={updateLoading}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <div>
                    <label className="text-sm font-medium text-gray-700">Account Enabled</label>
                    <p className="text-xs text-gray-500">
                        {user.enabled ? 'User can access the system' : 'User account is disabled'}
                    </p>
                </div>
            </div>

            {/* Compact User Details */}
            <div className="text-xs text-gray-500 space-y-1 pt-2">
                <p>User ID: {initialUser.userId}</p>
                <p>Email: {initialUser.email}</p>
                {initialUser.role && (
                    <p>Current Role: {initialUser.role.name}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed"
                disabled={updateLoading}
            >
                {updateLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving Changes...
                    </>
                ) : (
                    <>
                        <Edit className="w-5 h-5 mr-2" />
                        Save Changes
                    </>
                )}
            </button>
        </form>
    );
};