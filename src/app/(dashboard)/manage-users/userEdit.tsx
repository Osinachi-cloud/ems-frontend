import { baseUrL } from "@/env/URLs";
import { usePost } from "@/hooks/usePost";
import { Response, UserDto } from "@/types/reponse";
import { AlertTriangle, CheckCircle, Edit, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { InputField } from "./inputField";
import { FeedbackMessage } from "../inventory/feedback";

interface UserFormProps {
    onSuccess: () => void;
    onClose: () => void;
    initialUser: UserDto;
}

export const UserEditForm: React.FC<UserFormProps> = ({ onSuccess, onClose, initialUser }) => {
    const [user, setUser] = useState<{ firstName: string, lastName: string, enabled: boolean }>({
        firstName: initialUser.firstName || '',
        lastName: initialUser.lastName || '',
        enabled: initialUser.enabled,
    });

    const [response, setResponse] = useState<Response | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const userUpdateBody = useMemo(() => ({
        ...user,
    }), [user]);

    const {
        data: updateResponse,
        callApi: updateUserApi,
        isLoading: updateLoading
    } = usePost("PUT", userUpdateBody, `${baseUrL}/update-user?email=${initialUser.email}`, null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked }: any = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name as keyof typeof user]) { // Added type assertion for safety
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const validateForm = (data: typeof user) => {
        const newErrors: { [key: string]: string } = {};
        if (!data.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!data.lastName.trim()) newErrors.lastName = "Last name is required.";
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

            console.log("apiResponse ====>", apiResponse); // This should have your data

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

            <div className="space-y-4 pt-2">
                <div className="p-3 border border-gray-200 rounded-lg">
                    <InputField
                        name="enabled"
                        label="Account Status"
                        type="checkbox"
                        value={user.enabled}
                        onChange={handleChange}
                        disabled={updateLoading}
                    />
                </div>
            </div>

            <p className="text-xs text-gray-500 pt-2">User ID: {initialUser.userId}</p>
            <p className="text-xs text-gray-500">Email: {initialUser.email}</p>


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