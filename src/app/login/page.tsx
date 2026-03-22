// "use client"
// import React, { useEffect, useState } from 'react'
// import type { FormEventHandler, ReactElement } from 'react'
// import { useRouter } from 'next/navigation'
// import { baseUrL } from '@/env/URLs';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/stores/store';
// import { errorToast } from '@/hooks/UseToast';
// import 'react-toastify/dist/ReactToastify.css';
// import './page.css';
// import { loginSuccess } from '@/redux/features/authSlice';
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { ILoginResponse } from '@/types/user';

// type LoginForm = {
//   email: string
//   password: string
// }

// const LoginPage = () => {

//   const  { value , getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

//   const initialState: LoginForm = {
//     email: "",
//     password: "",
//   };

//   const [authDetails, setAuthDetails] = useState(initialState);
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // Local loading state
//   const dispatch = useDispatch<AppDispatch>();
//   const loginUrl = `${baseUrL}/customer-login`;
//   const router = useRouter();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     handlePost();
//     console.log('Form values', authDetails);
//   }

//   const handleTogglePasswordVisibility = () => {
//     setIsPasswordVisible((prev) => !prev);
//   };

//   const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
//     const value = evt.target.value;
//     setAuthDetails({
//       ...authDetails,
//       [evt.target.name]: value
//     });
//   }

//   const handlePost = async () => {
//     // Validate form
//     if (!authDetails.email || !authDetails.password) {
//       errorToast('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const apiResponse = await fetch(loginUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(authDetails)
//       })

//       let apiResponseData: ILoginResponse = await apiResponse.json();
//       console.log({ apiResponseData });

//       setStoredValue(apiResponseData.data);

//       if (apiResponse.ok) {
//         const transformedUserDetails = {
//           access_token: apiResponseData.data.accessToken,
//           refresh_token: apiResponseData.data.refreshToken,
//           role: apiResponseData.data.roleDto
//         };
        
//         console.log("Transformed user details:", transformedUserDetails);
//         dispatch(loginSuccess(transformedUserDetails));
//         router.push('/my-dashboard');

//       } else {
//         errorToast(apiResponseData.error || 'Login failed');
//       }
//     } catch (e) {
//       console.log(e);
//       errorToast('An error occurred or Poor Internet');
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <>
//       <div className="grid h-[100vh] w-full">
//         <form className="sm:w-[28%] w-[90%] mx-auto my-auto" onSubmit={handleSubmit}>
//           <div className='mb-[2rem]'>
//             <h1 className='text-center text-[#171717] text-[32px] font-[600]'>Login</h1>
//             <p className='text-center text-[#53545C] font-[300]'>Login to access Admin Dashboard</p>
//           </div>

//           <div>
//             <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//             <div className="my-[1.5rem] flex w-[100%] items-center border border-gray-300 rounded-lg">
//               <input
//                 className=" text-gray-900 bg-[#fff] text-sm rounded-lg block w-full p-2.5 py-3.5"
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={authDetails.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
//             <div className="flex w-[100%] items-center border border-gray-300 rounded-lg px-[1rem]">
//               <input
//                 className=" text-gray-900 bg-[#fff] text-sm rounded-lg outline-none block py-3.5 w-[95%]"
//                 type={isPasswordVisible ? 'text' : 'password'}
//                 id="password"
//                 name="password"
//                 value={authDetails.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 required
//               />
//               <div
//                 onClick={handleTogglePasswordVisibility}
//                 className=" h-[50px] flex items-center pr-3 w-[5%] cursor-pointer"
//               >
//                 {isPasswordVisible ? (
//                   <span role="img" aria-label="Hide password">👁️</span>
//                 ) : (
//                   <span role="img" aria-label="Show password">🙈</span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end m-2">
//             <a href="forgotpassword" className="ms-2 text-sm font-medium text-[grey]">Forgot Password?</a>
//           </div>

//           <div className='mt-[3rem]'>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center gap-6 text-white bg-[#37393f] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center disabled:bg-gray-400"
//             >
//               <span>Sign In</span>
//               {isLoading && <span className="spinner"></span>}
//             </button>
//           </div>

//           <div className='text-center mt-[1rem] text-[14px]'>
//             <a href="/signup">You do not have an account? Create Account</a>
//           </div>
//         </form>
//       </div>
//     </>
//   )
// }

// LoginPage.getLayout = function getLayout(page: ReactElement) {
//   // return <LayoutGuest>{page}</LayoutGuest>
// }

// export default LoginPage






"use client"
import React, { useState } from 'react'
import type { FormEventHandler, ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { errorToast } from '@/hooks/UseToast';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess } from '@/redux/features/authSlice';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ILoginResponse } from '@/types/user';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn,
    ArrowRight,
    Building2 
} from 'lucide-react';

type LoginForm = {
  email: string
  password: string
}

const LoginPage = () => {

  const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

  const initialState: LoginForm = {
    email: "",
    password: "",
  };

  const [authDetails, setAuthDetails] = useState(initialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const loginUrl = `${baseUrL}/customer-login`;
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost();
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setAuthDetails({
      ...authDetails,
      [evt.target.name]: value
    });
  }

  const handlePost = async () => {
    if (!authDetails.email || !authDetails.password) {
      errorToast('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const apiResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authDetails)
      })

      let apiResponseData: ILoginResponse = await apiResponse.json();

      setStoredValue(apiResponseData.data);

      if (apiResponse.ok) {
        const transformedUserDetails = {
          access_token: apiResponseData.data.accessToken,
          refresh_token: apiResponseData.data.refreshToken,
          role: apiResponseData.data.roleDto
        };
        
        dispatch(loginSuccess(transformedUserDetails));
        router.push('/my-dashboard');
      } else {
        errorToast(apiResponseData.error || 'Login failed');
      }
    } catch (e) {
      errorToast('An error occurred or No Internet');
    } finally {
      setIsLoading(false);
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-400';
    if (passwordStrength <= 50) return 'bg-orange-400';
    if (passwordStrength <= 75) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-md w-full mx-auto">
        {/* Simple white card with very light blue shadow */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50/50 overflow-hidden">
          
          {/* Minimalist header with very light blue */}
          <div className="bg-blue-50/30 px-6 sm:px-8 py-5 border-b border-blue-100/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100/50 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Welcome back</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Sign in to your account</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Email or Username<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={authDetails.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  value={authDetails.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a 
                href="/forgotpassword" 
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button - blue to match signup */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 relative py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors disabled:bg-blue-500 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>

            {/* Sign up link */}
            <p className="text-center text-xs text-gray-500 pt-2">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create account
              </a>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #374151 !important;
        }
      `}</style>
    </div>
  )
}

export default LoginPage