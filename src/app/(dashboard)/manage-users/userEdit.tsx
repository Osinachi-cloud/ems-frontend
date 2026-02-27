// import { baseUrL } from "@/env/URLs";
// import { usePost } from "@/hooks/usePost";
// import { Response, UserDto } from "@/types/reponse";
// import { AlertTriangle, CheckCircle, Edit, Loader2, ChevronDown } from "lucide-react";
// import { useCallback, useMemo, useState, useEffect } from "react";
// import { InputField } from "./inputField";
// import { FeedbackMessage } from "../inventory/feedback";
// import { useFetch } from "@/hooks/useFetch";

// interface UserFormProps {
//     onSuccess: () => void;
//     onClose: () => void;
//     initialUser: UserDto;
// }

// export const UserEditForm: React.FC<UserFormProps> = ({ onSuccess, onClose, initialUser }) => {
//     const [user, setUser] = useState<{ firstName: string, lastName: string, enabled: boolean, role: string }>({
//         firstName: initialUser.firstName || '',
//         lastName: initialUser.lastName || '',
//         role: initialUser.role?.name || '',
//         enabled: initialUser.enabled,
//     });

//     const [response, setResponse] = useState<Response | null>(null);
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     const userUpdateBody = useMemo(() => ({
//         ...user,
//     }), [user]);

//     const {
//         data: updateResponse,
//         callApi: updateUserApi,
//         isLoading: updateLoading
//     } = usePost("PUT", userUpdateBody, `${baseUrL}/update-user?email=${initialUser.email}`, null);

//     const {
//         data: roles,
//         callApi: fetchRoles,
//         isLoading: roleLoading
//     } = useFetch("GET", null, `${baseUrL}/roles?page=0&page=1000`);

//     useEffect(() => {
//         fetchRoles();
//     }, []);

//     const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value, type, checked }: any = e.target;
//         setUser(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//         if (errors[name as keyof typeof user]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     }, [errors]);

//     const handleRoleSelect = (roleName: string) => {
//         setUser(prev => ({
//             ...prev,
//             role: roleName,
//         }));
//         setIsDropdownOpen(false);
//         if (errors.role) {
//             setErrors(prev => ({ ...prev, role: '' }));
//         }
//     };

//     const validateForm = (data: typeof user) => {
//         const newErrors: { [key: string]: string } = {};
//         if (!data.firstName.trim()) newErrors.firstName = "First name is required.";
//         if (!data.lastName.trim()) newErrors.lastName = "Last name is required.";
//         if (!data.role.trim()) newErrors.role = "Role is required.";
//         return newErrors;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setResponse(null);

//         const validationErrors = validateForm(user);
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         setErrors({});

//         try {
//             const apiResponse: any = await updateUserApi();

//             console.log("apiResponse ====>", apiResponse);

//             if (apiResponse?.statusCode === 200 || apiResponse?.success) {
//                 setResponse({
//                     success: true,
//                     message: apiResponse.message || "User updated successfully.",
//                     data: apiResponse
//                 });

//                 setTimeout(() => {
//                     onSuccess();
//                 }, 1000);
//             } else {
//                 setResponse({
//                     success: false,
//                     message: apiResponse?.error || `Failed to update user.`,
//                     data: apiResponse
//                 });
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//             setResponse({
//                 success: false,
//                 message: error || 'An unexpected network error occurred.'
//             });
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             {response && <FeedbackMessage success={response.success} message={response.message} />}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField
//                     name="firstName"
//                     label="First Name"
//                     error={errors.firstName}
//                     value={user.firstName}
//                     onChange={handleChange}
//                     disabled={updateLoading}
//                 />
//                 <InputField
//                     name="lastName"
//                     label="Last Name"
//                     error={errors.lastName}
//                     value={user.lastName}
//                     onChange={handleChange}
//                     disabled={updateLoading}
//                 />
//             </div>

//             {/* Compact Role Dropdown */}
//             <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                     Role
//                 </label>
//                 <div className="relative">
//                     <button
//                         type="button"
//                         className={`w-full px-3 py-2 text-left bg-white border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 ${
//                             errors.role 
//                                 ? 'border-red-300' 
//                                 : 'border-gray-300'
//                         } ${updateLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//                         onClick={() => !updateLoading && setIsDropdownOpen(!isDropdownOpen)}
//                         disabled={updateLoading}
//                     >
//                         <div className="flex items-center justify-between">
//                             <span className={`${user.role ? 'text-gray-900' : 'text-gray-500'}`}>
//                                 {user.role || "Select role"}
//                             </span>
//                             <ChevronDown 
//                                 className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                                     isDropdownOpen ? 'transform rotate-180' : ''
//                                 }`}
//                             />
//                         </div>
//                     </button>

//                     {isDropdownOpen && (
//                         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
//                             {roleLoading ? (
//                                 <div className="flex items-center justify-center py-2 px-3">
//                                     <Loader2 className="w-4 h-4 mr-2 animate-spin text-teal-600" />
//                                     <span className="text-sm text-gray-500">Loading...</span>
//                                 </div>
//                             ) : roles?.data?.data?.length > 0 ? (
//                                 roles.data.data.map((r: any) => (
//                                     <div
//                                         key={r.id}
//                                         className={`px-3 py-2 cursor-pointer text-sm transition-colors duration-150 ${
//                                             user.role === r.name
//                                                 ? 'bg-teal-50 text-teal-900'
//                                                 : 'hover:bg-gray-50 text-gray-900'
//                                         }`}
//                                         onClick={() => handleRoleSelect(r.name)}
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <span>{r.name}</span>
//                                             {user.role === r.name && (
//                                                 <CheckCircle className="w-4 h-4 text-teal-600" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="px-3 py-2 text-gray-500 text-sm text-center">
//                                     No roles available
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//                 {errors.role && (
//                     <p className="text-sm text-red-600 flex items-center mt-1">
//                         <AlertTriangle className="w-3 h-3 mr-1" />
//                         {errors.role}
//                     </p>
//                 )}
//             </div>

//             {/* Compact Account Status */}
//             <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
//                 <input
//                     type="checkbox"
//                     name="enabled"
//                     checked={user.enabled}
//                     onChange={handleChange}
//                     disabled={updateLoading}
//                     className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
//                 />
//                 <div>
//                     <label className="text-sm font-medium text-gray-700">Account Enabled</label>
//                     <p className="text-xs text-gray-500">
//                         {user.enabled ? 'User can access the system' : 'User account is disabled'}
//                     </p>
//                 </div>
//             </div>

//             {/* Compact User Details */}
//             <div className="text-xs text-gray-500 space-y-1 pt-2">
//                 <p>User ID: {initialUser.userId}</p>
//                 <p>Email: {initialUser.email}</p>
//                 {initialUser.role && (
//                     <p>Current Role: {initialUser.role.name}</p>
//                 )}
//             </div>

//             {/* Submit Button */}
//             <button
//                 type="submit"
//                 className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 disabled:bg-teal-400 disabled:cursor-not-allowed"
//                 disabled={updateLoading}
//             >
//                 {updateLoading ? (
//                     <>
//                         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                         Saving Changes...
//                     </>
//                 ) : (
//                     <>
//                         <Edit className="w-5 h-5 mr-2" />
//                         Save Changes
//                     </>
//                 )}
//             </button>
//         </form>
//     );
// };



import { baseUrL } from "@/env/URLs";
import { usePost } from "@/hooks/usePost";
import { Response, UserDto } from "@/types/reponse";
import { AlertTriangle, CheckCircle, Edit, Loader2, ChevronDown } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
// import  InputField  from "./inputField";
import { FeedbackMessage } from "../inventory/feedback";
import { useFetch } from "@/hooks/useFetch";
import { InputFieldProps } from "@/types/reponse";
import React from "react";

// Enum for Designation (should match your backend)
enum Designation {
    LANDLORD = "LANDLORD",
    TENANT = "TENANT",
    OCCUPANT = "OCCUPANT",
    EXTERNAL = "EXTERNAL",
    DEFAULT = "DEFAULT",
}

interface UserFormProps {
    onSuccess: () => void;
    onClose: () => void;
    initialUser: UserDto;
}

const UserEditForm: React.FC<UserFormProps> = ({ onSuccess, onClose, initialUser }) => {
    const [user, setUser] = useState<{ 
        firstName: string, 
        lastName: string, 
        enabled: boolean, 
        role: string,
        designation: string 
    }>({
        firstName: initialUser.firstName || '',
        lastName: initialUser.lastName || '',
        role: initialUser.role?.name || '',
        designation: initialUser.designation || '',
        enabled: initialUser.enabled,
    });

    const [response, setResponse] = useState<Response | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isDesignationDropdownOpen, setIsDesignationDropdownOpen] = useState(false);

    const userUpdateBody = useMemo(() => ({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        designation: user.designation,
        enabled: user.enabled,
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
    } = useFetch("GET", null, `${baseUrL}/roles?page=0&size=1000`);

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
        setIsRoleDropdownOpen(false);
        if (errors.role) {
            setErrors(prev => ({ ...prev, role: '' }));
        }
    };

    const handleDesignationSelect = (designation: string) => {
        setUser(prev => ({
            ...prev,
            designation: designation,
        }));
        setIsDesignationDropdownOpen(false);
        if (errors.designation) {
            setErrors(prev => ({ ...prev, designation: '' }));
        }
    };

    const validateForm = (data: typeof user) => {
        const newErrors: { [key: string]: string } = {};
        if (!data.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!data.lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!data.role.trim()) newErrors.role = "Role is required.";
        if (!data.designation.trim()) newErrors.designation = "Designation is required.";
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

    // Format designation for display
    const formatDesignationDisplay = (designation: string): string => {
        switch (designation) {
            case Designation.LANDLORD:
                return '🏠 Landlord';
            case Designation.TENANT:
                return '👤 Tenant';
            case Designation.OCCUPANT:
                return '👨‍👩‍👧‍👦 Occupant';
            case Designation.EXTERNAL:
                return '🌐 External';
            case Designation.DEFAULT:
                return '📋 Default';
            default:
                return designation;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {response && <FeedbackMessage success={response.success} message={response.message} />}

            {/* Name Fields - 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Role and Designation - 2 columns side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role Dropdown */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            className={`w-full px-3 py-2.5 text-left bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                                errors.role 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-300 hover:border-gray-400'
                            } ${updateLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => !updateLoading && setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            disabled={updateLoading}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`${user.role ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {user.role || "Select role"}
                                </span>
                                <ChevronDown 
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                        isRoleDropdownOpen ? 'transform rotate-180' : ''
                                    }`}
                                />
                            </div>
                        </button>

                        {isRoleDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)} />
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {roleLoading ? (
                                        <div className="flex items-center justify-center py-3 px-4">
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin text-teal-600" />
                                            <span className="text-sm text-gray-500">Loading...</span>
                                        </div>
                                    ) : roles?.data?.data?.length > 0 ? (
                                        roles.data.data.map((r: any) => (
                                            <div
                                                key={r.id}
                                                className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 ${
                                                    user.role === r.name
                                                        ? 'bg-teal-50 text-teal-700 font-medium'
                                                        : 'hover:bg-gray-50 text-gray-700'
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
                                        <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                            No roles available
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {errors.role && (
                        <p className="text-xs text-red-600 flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                            {errors.role}
                        </p>
                    )}
                </div>

                {/* Designation Dropdown */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">
                        Designation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            className={`w-full px-3 py-2.5 text-left bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                                errors.designation 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-300 hover:border-gray-400'
                            } ${updateLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => !updateLoading && setIsDesignationDropdownOpen(!isDesignationDropdownOpen)}
                            disabled={updateLoading}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`${user.designation ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {user.designation ? formatDesignationDisplay(user.designation) : "Select designation"}
                                </span>
                                <ChevronDown 
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                        isDesignationDropdownOpen ? 'transform rotate-180' : ''
                                    }`}
                                />
                            </div>
                        </button>

                        {isDesignationDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDesignationDropdownOpen(false)} />
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {Object.values(Designation).map((designation) => (
                                        <div
                                            key={designation}
                                            className={`px-4 py-2.5 cursor-pointer text-sm transition-colors duration-150 ${
                                                user.designation === designation
                                                    ? 'bg-teal-50 text-teal-700 font-medium'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                            onClick={() => handleDesignationSelect(designation)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{formatDesignationDisplay(designation)}</span>
                                                {user.designation === designation && (
                                                    <CheckCircle className="w-4 h-4 text-teal-600" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {errors.designation && (
                        <p className="text-xs text-red-600 flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                            {errors.designation}
                        </p>
                    )}
                </div>
            </div>

            {/* Account Status - Full width with better styling */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        name="enabled"
                        id="enabled"
                        checked={user.enabled}
                        onChange={handleChange}
                        disabled={updateLoading}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="enabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Account Enabled
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {user.enabled 
                            ? 'User can access the system and perform actions' 
                            : 'User account is disabled and cannot access the system'}
                    </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {user.enabled ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* User Details - Compact card style */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    User Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-start">
                        <span className="text-gray-500 w-20 flex-shrink-0">User ID:</span>
                        <span className="text-gray-900 font-mono break-all">{initialUser.userId}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-500 w-20 flex-shrink-0">Email:</span>
                        <span className="text-gray-900 break-all">{initialUser.email}</span>
                    </div>
                    {initialUser.role && (
                        <div className="flex items-start">
                            <span className="text-gray-500 w-20 flex-shrink-0">Current Role:</span>
                            <span className="text-gray-900">{initialUser.role.name}</span>
                        </div>
                    )}
                    {initialUser.designation && (
                        <div className="flex items-start">
                            <span className="text-gray-500 w-20 flex-shrink-0">Current Designation:</span>
                            <span className="text-gray-900">{formatDesignationDisplay(initialUser.designation)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg shadow-md hover:from-teal-700 hover:to-teal-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-teal-600 disabled:hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                disabled={updateLoading}
            >
                {updateLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Saving Changes...</span>
                    </>
                ) : (
                    <>
                        <Edit className="w-5 h-5 mr-2" />
                        <span>Save Changes</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default UserEditForm







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

// export default InputField;