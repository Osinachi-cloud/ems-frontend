// "use client"
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { baseUrL } from '@/env/URLs';
// import { errorToast, successToast } from '@/hooks/UseToast';
// import 'react-toastify/dist/ReactToastify.css';
// import './page.css';

// interface Estate {
//     country: string;
//     state: string | null;
//     city: string;
//     name: string | null;
//     postalCode: string | null;
//     estateId: string;
//     estateAdminUserId: string | null;
//     firstName: string | null;
//     lastName: string | null;
//     phone: string | null;
//     email: string | null;
//     designation: string | null;
// }

// interface EstatesResponse {
//     message: string;
//     statusCode: number;
//     error: string | null;
//     timestamp: string;
//     data: {
//         page: number;
//         size: number;
//         total: number;
//         data: Estate[];
//     };
// }

// // Enum values for designation
// enum Designation {
//     LANDLORD = "LANDLORD",
//     TENANT = "TENANT",
//     EXTERNAL = "EXTERNAL",
//     DEFAULT = "DEFAULT",
// }

// const SignUp = () => {
//     const router = useRouter();

//     // State object for form fields
//     const [userInfo, setUserInfo] = useState({
//         firstName: '',
//         lastName: '',
//         designation: '',
//         email: '',
//         phoneNumber: '',
//         password: '',
//         estateId: '',
//     });

//     const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [estates, setEstates] = useState<Estate[]>([]);
//     const [isLoadingEstates, setIsLoadingEstates] = useState(false);

//     // API configuration
//     const signupUrl = `${baseUrL}/create-customer`;
//     const estatesUrl = `${baseUrL}/get-estates`;

//     // Fetch estates on component mount
//     useEffect(() => {
//         const fetchEstates = async () => {
//             try {
//                 setIsLoadingEstates(true);
//                 console.log('Fetching estates from:', estatesUrl);

//                 const response = await fetch(estatesUrl);
//                 const data: EstatesResponse = await response.json();

//                 if (response.ok && data.data?.data) {
//                     setEstates(data.data.data);
//                     console.log('Estates fetched successfully:', data.data.data);
//                 } else {
//                     console.error('Failed to fetch estates:', data.message);
//                     errorToast('Failed to load estates list');
//                 }
//             } catch (error) {
//                 console.error('Error fetching estates:', error);
//                 errorToast('Error loading estates list');
//             } finally {
//                 setIsLoadingEstates(false);
//             }
//         };

//         fetchEstates();
//     }, [estatesUrl]);

//     // Handle input change
//     const handleChange = (e: any) => {
//         const { name, value, type, checked } = e.target;
//         setUserInfo((prevState) => ({
//             ...prevState,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         console.log("Submitting form with data:", userInfo);

//         if (userInfo.password.length < 8) {
//             errorToast("Password must be at least 8 characters long");
//             return;
//         }

//         if (!userInfo.estateId) {
//             errorToast("Please select an estate");
//             return;
//         }

//         if (!userInfo.designation) {
//             errorToast("Please select a designation");
//             return;
//         }

//         const { ...signupData } = userInfo;

//         try {
//             setIsLoading(true);
//             console.log('Making API call to:', signupUrl);
//             console.log('With data:', signupData);

//             const apiResponse = await fetch(signupUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     // 'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIrMjM0MDk4NzY1NDEiLCJlbWFpbCI6ImFwcGFkbWluQGVtcy5jb20iLCJyb2xlIjoiUk9MRV9BUFBfQURNSU4iLCJwZXJtaXNzaW9ucyI6WyJDUkVBVEVfU1VQRVJfQURNSU4iLCJPTkJPQVJEX0VTVEFURSIsIkZFVENIX0FMTF9DVVNUT01FUlMiXSwiaWF0IjoxNzcwNTcyMzE5LCJleHAiOjE3NzA3NTIzMTl9.3ECtaK5HfgwXBSCEFEE8yB1QkPoxU5VBv8GiuPqsEAAbnAPC8eyW-5fYrwJosbWZcOHDd0bjoVQs1xo9yzH6gg`
//                 },
//                 body: JSON.stringify(signupData)
//             });

//             const apiResponseData = await apiResponse.json();
//             console.log('Signup response:', apiResponseData);

//             if (apiResponse.ok) {
//                 successToast('Account created successfully!');
//                 setTimeout(() => {
//                     router.push('/login');
//                 }, 2000);
//             } else {
//                 errorToast(apiResponseData.error || 'Signup failed');
//             }
//         } catch (error) {
//             console.error('Signup error:', error);
//             errorToast("Error creating account");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setIsPasswordVisible(!isPasswordVisible);
//     };

//     // Function to generate display name for estate
//     const getEstateDisplayName = (estate: Estate): string => {
//         if (estate.name) {
//             return estate.name;
//         }

//         const locationParts = [
//             estate.city,
//             estate.state,
//             estate.country
//         ].filter(part => part !== null && part !== undefined && part !== '');

//         return locationParts.join(', ') || `Estate ${estate.estateId}`;
//     };

//     // Function to format designation for display
//     const formatDesignationDisplay = (designation: Designation): string => {
//         switch (designation) {
//             case Designation.LANDLORD:
//                 return 'Landlord';
//             case Designation.TENANT:
//                 return 'Tenant';
//             case Designation.EXTERNAL:
//                 return 'External';
//             case Designation.DEFAULT:
//                 return 'Default';
//             default:
//                 return designation;
//         }
//     };

//     return (
//         <div>
//             <div className="flex items-center justify-center min-h-screen ">
//                 <div className="p-8 rounded-lg max-w-3xl">
//                     <h1 className="text-[30px] font-bold text-center mb-1">Create a new account</h1>
//                     <p className="text-center text-gray-600 mb-10">Fill in your details & get started!</p>
//                     <form onSubmit={handleSubmit}>
//                         <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
//                             <div>
//                                 <label className="block text-gray-700">First Name</label>
//                                 <input
//                                     type="text"
//                                     name="firstName"
//                                     placeholder="First Name"
//                                     value={userInfo.firstName}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700">Last Name</label>
//                                 <input
//                                     type="text"
//                                     name="lastName"
//                                     placeholder="Last Name"
//                                     value={userInfo.lastName}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
//                                 />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
//                             <div>
//                                 <label className="block text-gray-700">Email Address</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="Email Address"
//                                     value={userInfo.email}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-700">Estate</label>
//                                 <select
//                                     name="estateId"
//                                     value={userInfo.estateId}
//                                     onChange={handleChange}
//                                     required
//                                     disabled={isLoadingEstates}
//                                     className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem] disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <option value="">Select an Estate</option>
//                                     {estates.map((estate) => (
//                                         <option key={estate.estateId} value={estate.estateId}>
//                                             {getEstateDisplayName(estate)}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {isLoadingEstates && (
//                                     <p className="text-sm text-gray-500 mt-1">Loading estates...</p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-1 mb-8">
//                             <div>
//                                 <label className="block text-gray-700">Designation</label>
//                                 <select 
//                                     name="designation" 
//                                     value={userInfo.designation}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
//                                 >
//                                     <option value="">Select Designation</option>
//                                     {Object.values(Designation).map((designation) => (
//                                         <option key={designation} value={designation}>
//                                             {formatDesignationDisplay(designation)}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
//                             <div>
//                                 <label className="block text-gray-700">Phone Number</label>
//                                 <input
//                                     type="tel"
//                                     name="phoneNumber"
//                                     placeholder="Phone Number"
//                                     value={userInfo.phoneNumber}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
//                                 />
//                             </div>
//                             <div className="relative">
//                                 <label className="block text-gray-700">Password</label>
//                                 <div className="flex items-center border border-gray-300 rounded mt-1">
//                                     <input
//                                         type={isPasswordVisible ? 'text' : 'password'}
//                                         name="password"
//                                         placeholder="Password"
//                                         value={userInfo.password}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-2 py-[0.8rem] bg-transparent outline-none"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={togglePasswordVisibility}
//                                         className="px-3 text-gray-400 cursor-pointer"
//                                     >
//                                         {isPasswordVisible ? '🙈' : '👁️'}
//                                     </button>
//                                 </div>
//                                 <div className="md:grid-cols-2 gap-4 my-3">
//                                     <p className="text-xs text-gray-500">Password should be at least <span className="font-bold">8 Characters</span> and must contain at least a <span className="font-bold">Capital Letter</span>, a <span className="font-bold">Number</span> and a <span className="font-bold">Special Character</span>.</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <button 
//                             type="submit" 
//                             disabled={isLoading || isLoadingEstates}
//                             className="w-full bg-gray-800 text-white p-2 rounded py-[1rem] mt-[2rem] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <span className="spinner"></span>
//                                     Creating Account...
//                                 </>
//                             ) : (
//                                 'Create Account'
//                             )}
//                         </button>
//                     </form>
//                     <p className="text-center text-gray-600 mt-4">
//                         Have an existing account? <a href="/login" className="text-gray-800 font-bold">Sign in</a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignUp;




"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { baseUrL } from '@/env/URLs';
import { errorToast, successToast } from '@/hooks/UseToast';
import { useFetch } from '@/hooks/useFetch';
import 'react-toastify/dist/ReactToastify.css';
import {
    Building2,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Home,
    Users,
    Briefcase,
    ArrowRight,
    ChevronRight
} from 'lucide-react';

interface Estate {
    country: string;
    state: string | null;
    city: string;
    name: string | null;
    postalCode: string | null;
    estateId: string;
    estateAdminUserId: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string | null;
    designation: string | null;
}

interface EstatesResponse {
    message: string;
    statusCode: number;
    error: string | null;
    timestamp: string;
    data: {
        page: number;
        size: number;
        total: number;
        data: Estate[];
    };
}

enum Designation {
    LANDLORD = "LANDLORD",
    TENANT = "TENANT",
    OCCUPANT = "OCCUPANT",
    EXTERNAL = "EXTERNAL",
    DEFAULT = "DEFAULT",
}

const SignUp = () => {
    const router = useRouter();

    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        designation: '',
        email: '',
        phoneNumber: '',
        password: '',
        estateId: '',
        landlordId: '',
        tenantId: '',
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [estates, setEstates] = useState<Estate[]>([]);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const signupUrl = `${baseUrL}/create-customer`;
    const estatesUrl = `${baseUrL}/get-estates`;

    const {
        data: estatesResponse,
        isLoading: isLoadingEstates,
        callApi: refetchEstates
    } = useFetch("GET", null, estatesUrl);

    useEffect(() => {
        if (estatesResponse?.data?.data) {
            setEstates(estatesResponse.data.data);
        }
    }, [estatesResponse]);

    const {
        data: landlords,
        isLoading: isLoadingLandlords,
        callApi: fetchLandlordDetails
    } = useFetch("GET", null, `${baseUrL}/find-by-estate-and-designation?estateId=${userInfo.estateId}&designation=${Designation.LANDLORD}`);

    const {
        data: tenants,
        isLoading: isLoadingTenants,
        callApi: fetchTenantDetails
    } = useFetch("GET", null, `${baseUrL}/find-by-landlord-and-designation?landlordId=${userInfo.landlordId}&designation=${Designation.TENANT}`);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setUserInfo((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEstateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            estateId: value,
            designation: '',
            landlordId: '',
            tenantId: ''
        }));
    };

    const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            designation: value,
            landlordId: '',
            tenantId: ''
        }));
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password?.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUserInfo(prev => ({ ...prev, password: value }));
        calculatePasswordStrength(value);
    };

    const validateForm = () => {
        if (!userInfo.estateId) {
            errorToast("Please select an estate");
            return false;
        }

        if (!userInfo.designation) {
            errorToast("Please select a designation");
            return false;
        }

        if (userInfo.designation === Designation.TENANT && !userInfo.landlordId) {
            errorToast("Please select a landlord");
            return false;
        }

        if (userInfo.designation === Designation.OCCUPANT && !userInfo.landlordId) {
            errorToast("Please select a landlord");
            return false;
        }

        if (userInfo?.password?.length < 8) {
            errorToast("Password must be at least 8 characters long");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const signupData: any = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            password: userInfo.password,
            estateId: userInfo.estateId,
            designation: userInfo.designation
        };

        if (userInfo.designation === Designation.TENANT) {
            signupData.landlordId = userInfo.landlordId;
        } else if (userInfo.designation === Designation.OCCUPANT) {
            signupData.landlordId = userInfo.landlordId;
            if (userInfo.tenantId) {
                signupData.tenantId = userInfo.tenantId;
            }
        }

        try {
            setIsLoading(true);

            const response = await fetch(signupUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            const data = await response.json();

            if (response.ok) {
                successToast('Account created successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                errorToast(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            errorToast("Error creating account");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const getEstateDisplayName = (estate: Estate): string => {
        if (estate.name) {
            return estate.name;
        }

        const locationParts = [
            estate.city,
            estate.state,
            estate.country
        ].filter(part => part !== null && part !== undefined && part !== '');

        return locationParts.join(', ') || `Estate ${estate.estateId.slice(0, 8)}...`;
    };

    const formatDesignationDisplay = (designation: Designation): string => {
        switch (designation) {
            case Designation.LANDLORD:
                return 'Landlord';
            case Designation.TENANT:
                return 'Tenant';
            case Designation.OCCUPANT:
                return 'Occupant';
            case Designation.EXTERNAL:
                return 'External';
            case Designation.DEFAULT:
                return 'Default';
            default:
                return designation;
        }
    };

    const getUserDisplayName = (user: any): string => {
        return `${user.firstName} ${user.lastName} • ${user.phoneNumber}`;
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-red-400';
        if (passwordStrength <= 50) return 'bg-orange-400';
        if (passwordStrength <= 75) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Simple white card with very light blue shadow */}
                <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50/50 overflow-hidden">
                    
                    {/* Minimalist header with very light blue */}
                    <div className="bg-blue-50/30 px-6 sm:px-8 py-5 border-b border-blue-100/50">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-100/50 rounded-lg">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Create account</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Join your estate community</p>
                            </div>
                        </div>
                    </div>

                    {/* Compact progress indicator */}
                    {userInfo.estateId && (
                        <div className="px-6 sm:px-8 pt-5">
                            <div className="flex items-center gap-1 sm:gap-2 text-xs">
                                <span className={`flex items-center gap-1 ${userInfo.estateId ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${userInfo.estateId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {userInfo.estateId ? '✓' : '1'}
                                    </span>
                                    <span className="hidden sm:inline">Estate</span>
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <span className={`flex items-center gap-1 ${userInfo.designation ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${userInfo.designation ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {userInfo.designation ? '✓' : '2'}
                                    </span>
                                    <span className="hidden sm:inline">Role</span>
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <span className={`flex items-center gap-1 ${userInfo.firstName ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${userInfo.firstName ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {userInfo.firstName ? '✓' : '3'}
                                    </span>
                                    <span className="hidden sm:inline">Details</span>
                                </span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                        {/* Estate Selection */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Estate <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    name="estateId"
                                    value={userInfo.estateId}
                                    onChange={handleEstateChange}
                                    required
                                    disabled={isLoadingEstates}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                                >
                                    <option value="" className="text-gray-500">Select your estate</option>
                                    {estates && estates?.map((estate) => (
                                        <option key={estate.estateId} value={estate.estateId} className="text-gray-700">
                                            {getEstateDisplayName(estate)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {isLoadingEstates && (
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                    <span className="animate-pulse">Loading estates...</span>
                                </p>
                            )}
                        </div>

                        {/* Designation Selection */}
                        {userInfo.estateId && (
                            <div className="space-y-1.5 animate-[fadeIn_0.3s_ease]">
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    Role <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        name="designation"
                                        value={userInfo.designation}
                                        onChange={handleDesignationChange}
                                        required
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 appearance-none"
                                    >
                                        <option value="" className="text-gray-500">Select your role</option>
                                        {Object.values(Designation)?.map((designation) => (
                                            <option key={designation} value={designation} className="text-gray-700">
                                                {formatDesignationDisplay(designation)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Conditional Fields */}
                        {userInfo.estateId && userInfo.designation && (
                            <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
                                {/* Landlord Selection */}
                                {(userInfo.designation === Designation.TENANT || userInfo.designation === Designation.OCCUPANT) && (
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                            Landlord <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Home className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <select
                                                name="landlordId"
                                                value={userInfo.landlordId}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoadingLandlords || landlords?.length === 0}
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                                            >
                                                <option value="" className="text-gray-500">Choose a landlord</option>
                                                {landlords && landlords?.data?.map((landlord: any) => (
                                                    <option key={landlord.userId} value={landlord.userId} className="text-gray-700">
                                                        {getUserDisplayName(landlord)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {isLoadingLandlords && (
                                            <p className="text-xs text-gray-500">Loading landlords...</p>
                                        )}
                                        {!isLoadingLandlords && landlords?.length === 0 && (
                                            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                                                No landlords found in this estate
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Tenant Selection - Optional */}
                                {userInfo.designation === Designation.OCCUPANT && userInfo.landlordId && (
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                            Tenant <span className="text-gray-400 text-[10px] ml-1">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Users className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <select
                                                name="tenantId"
                                                value={userInfo.tenantId}
                                                onChange={handleChange}
                                                disabled={isLoadingTenants}
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:bg-gray-50 appearance-none"
                                            >
                                                <option value="" className="text-gray-500">Select tenant (optional)</option>
                                                {tenants && tenants?.data?.map((tenant: any) => (
                                                    <option key={tenant.userId} value={tenant.userId} className="text-gray-700">
                                                        {getUserDisplayName(tenant)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Personal Information - Compact grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    First name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={userInfo.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="John"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    Last name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userInfo.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Doe"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userInfo.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    Phone <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={userInfo.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+234 801 234 5678"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password field - compact */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="password"
                                    value={userInfo.password}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {isPasswordVisible ? (
                                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>

                            {/* Password strength - minimal */}
                            {userInfo.password && (
                                <div className="mt-2 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                style={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-500">
                                            {passwordStrength <= 25 && 'Weak'}
                                            {passwordStrength > 25 && passwordStrength <= 50 && 'Fair'}
                                            {passwordStrength > 50 && passwordStrength <= 75 && 'Good'}
                                            {passwordStrength > 75 && 'Strong'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        8+ chars, 1 capital, 1 number, 1 special
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit button - clean and simple */}
                        <button
                            type="submit"
                            disabled={isLoading || !userInfo.estateId || !userInfo.designation}
                            className="w-full mt-4 relative py-2.5 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Sign in link */}
                        <p className="text-center text-xs text-gray-500 pt-2">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default SignUp;