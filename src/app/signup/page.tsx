"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { baseUrL } from '@/env/URLs';
import { errorToast, successToast } from '@/hooks/UseToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';

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

// Enum values for designation
enum Designation {
    LANDLORD = "LANDLORD",
    TENANT = "TENANT",
    EXTERNAL = "EXTERNAL",
    DEFAULT = "DEFAULT",
}

const SignUp = () => {
    const router = useRouter();
    
    // State object for form fields
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        designation: '',
        email: '',
        phoneNumber: '',
        password: '',
        estateId: '',
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [estates, setEstates] = useState<Estate[]>([]);
    const [isLoadingEstates, setIsLoadingEstates] = useState(false);
    
    // API configuration
    const signupUrl = `${baseUrL}/create-customer`;
    const estatesUrl = `${baseUrL}/get-estates`;

    // Fetch estates on component mount
    useEffect(() => {
        const fetchEstates = async () => {
            try {
                setIsLoadingEstates(true);
                console.log('Fetching estates from:', estatesUrl);
                
                const response = await fetch(estatesUrl);
                const data: EstatesResponse = await response.json();
                
                if (response.ok && data.data?.data) {
                    setEstates(data.data.data);
                    console.log('Estates fetched successfully:', data.data.data);
                } else {
                    console.error('Failed to fetch estates:', data.message);
                    errorToast('Failed to load estates list');
                }
            } catch (error) {
                console.error('Error fetching estates:', error);
                errorToast('Error loading estates list');
            } finally {
                setIsLoadingEstates(false);
            }
        };

        fetchEstates();
    }, [estatesUrl]);

    // Handle input change
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("Submitting form with data:", userInfo);

        if (userInfo.password.length < 8) {
            errorToast("Password must be at least 8 characters long");
            return;
        }

        if (!userInfo.estateId) {
            errorToast("Please select an estate");
            return;
        }

        if (!userInfo.designation) {
            errorToast("Please select a designation");
            return;
        }

        const { ...signupData } = userInfo;

        try {
            setIsLoading(true);
            console.log('Making API call to:', signupUrl);
            console.log('With data:', signupData);

            const apiResponse = await fetch(signupUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            const apiResponseData = await apiResponse.json();
            console.log('Signup response:', apiResponseData);

            if (apiResponse.ok) {
                successToast('Account created successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                errorToast(apiResponseData.error || 'Signup failed');
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

    // Function to generate display name for estate
    const getEstateDisplayName = (estate: Estate): string => {
        if (estate.name) {
            return estate.name;
        }
        
        const locationParts = [
            estate.city,
            estate.state,
            estate.country
        ].filter(part => part !== null && part !== undefined && part !== '');
        
        return locationParts.join(', ') || `Estate ${estate.estateId}`;
    };

    // Function to format designation for display
    const formatDesignationDisplay = (designation: Designation): string => {
        switch (designation) {
            case Designation.LANDLORD:
                return 'Landlord';
            case Designation.TENANT:
                return 'Tenant';
            case Designation.EXTERNAL:
                return 'External';
            case Designation.DEFAULT:
                return 'Default';
            default:
                return designation;
        }
    };

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className="flex items-center justify-center min-h-screen ">
                <div className="p-8 rounded-lg max-w-3xl">
                    <h1 className="text-[30px] font-bold text-center mb-1">Create a new account</h1>
                    <p className="text-center text-gray-600 mb-10">Fill in your details & get started!</p>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={userInfo.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={userInfo.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Estate</label>
                                <select
                                    name="estateId"
                                    value={userInfo.estateId}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoadingEstates}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select an Estate</option>
                                    {estates.map((estate) => (
                                        <option key={estate.estateId} value={estate.estateId}>
                                            {getEstateDisplayName(estate)}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingEstates && (
                                    <p className="text-sm text-gray-500 mt-1">Loading estates...</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-1 mb-8">
                            <div>
                                <label className="block text-gray-700">Designation</label>
                                <select 
                                    name="designation" 
                                    value={userInfo.designation}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                >
                                    <option value="">Select Designation</option>
                                    {Object.values(Designation).map((designation) => (
                                        <option key={designation} value={designation}>
                                            {formatDesignationDisplay(designation)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={userInfo.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Password</label>
                                <div className="flex items-center border border-gray-300 rounded mt-1">
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 py-[0.8rem] bg-transparent outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="px-3 text-gray-400 cursor-pointer"
                                    >
                                        {isPasswordVisible ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <div className="md:grid-cols-2 gap-4 my-3">
                                    <p className="text-xs text-gray-500">Password should be at least <span className="font-bold">8 Characters</span> and must contain at least a <span className="font-bold">Capital Letter</span>, a <span className="font-bold">Number</span> and a <span className="font-bold">Special Character</span>.</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading || isLoadingEstates}
                            className="w-full bg-gray-800 text-white p-2 rounded py-[1rem] mt-[2rem] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                    <p className="text-center text-gray-600 mt-4">
                        Have an existing account? <a href="/login" className="text-gray-800 font-bold">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;