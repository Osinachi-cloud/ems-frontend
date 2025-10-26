"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { baseUrL } from '@/env/URLs';
import { errorToast, successToast } from '@/hooks/UseToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';

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
        // confirmPassword: '',
        estateId: '',
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // API configuration
    const signupUrl = `${baseUrL}/create-customer`;

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

        // Basic validation
        // if (userInfo.password !== userInfo.confirmPassword) {
        //     errorToast("Passwords don't match");
        //     return;
        // }

        if (userInfo.password.length < 8) {
            errorToast("Password must be at least 8 characters long");
            return;
        }

        // Remove confirmPassword from the data sent to API
        // const { confirmPassword, ...signupData } = userInfo;

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
                // Wait a bit for the toast to show before redirecting
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                errorToast(apiResponseData.message || 'Signup failed');
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

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    return (
        <div>
            {/* Toast Container - This is essential for toasts to work */}
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
                <div className="p-8 rounded-lg max-w-4xl">
                    <h1 className="text-[30px] font-bold text-center mb-1">Create a new account</h1>
                    <p className="text-center text-gray-600 mb-10">Fill in your details & get started!</p>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="firstName"
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
                                <input
                                    type="text"
                                    name="estateId"
                                    placeholder="estateId"
                                    value={userInfo.estateId}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-1 mb-8">
                            <div>
                                <label className="block text-gray-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="Designation"
                                    value={userInfo.designation}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                />
                                {/* <select name="designation" id="" className="w-full p-2 border border-gray-300 rounded mt-1 py-[0.8rem]"
                                    value={userInfo.designation}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">TENANT</option>
                                    <option value="">Land Lord</option>
                                </select> */}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2 mb-8">
                            <div>
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="phoneNumber"
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
                            disabled={isLoading}
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