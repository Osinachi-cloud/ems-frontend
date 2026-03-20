"use client"
import React, { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { baseUrL } from '@/env/URLs';
import { errorToast, successToast } from '@/hooks/UseToast';
import 'react-toastify/dist/ReactToastify.css';
import { isPublicRoute } from '../config/publicRoutes';
import { 
    Mail, 
    KeyRound, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Send
} from 'lucide-react';

type ForgotPasswordPageForm = {
  email: string;
  resetCode: string;
  password: string;
  confirmPassword: string;
}

const ForgotPasswordPage = () => {
  const initialState: ForgotPasswordPageForm = {
    email: "",
    resetCode: "",
    password: "",
    confirmPassword: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  
  const requestOtpUrl = `${baseUrL}/request-password-reset`;
  const resetPasswordUrl = `${baseUrL}/reset-password`;
  const router = useRouter();
  const pathname = usePathname();

  // Debug logging
  useEffect(() => {
    console.log('Current pathname:', pathname);
    console.log('Is public route:', isPublicRoute(pathname));
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordReset();
  }

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength when password changes
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    if (password.match(/[$@#&!]+/)) strength += 25;
    setPasswordStrength(Math.min(strength, 100));
  };

  const handlePasswordReset = async () => {
    // Validate based on current step
    if (!isOtpSent) {
      if (!formData.email) {
        errorToast('Please enter your email address');
        return;
      }
    } else {
      if (!formData.resetCode || !formData.password || !formData.confirmPassword) {
        errorToast('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        errorToast('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        errorToast('Password must be at least 8 characters long');
        return;
      }
    }

    setIsLoading(true);
    try {
      const url = isOtpSent ? resetPasswordUrl : requestOtpUrl;
      
      const requestBody = isOtpSent ? {
        email: formData.email,
        resetCode: formData.resetCode,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      } : {
        email: formData.email
      };

      const apiResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await apiResponse.json();

      if (apiResponse.ok) {
        if (!isOtpSent) {
          // OTP sent successfully
          setIsOtpSent(true);
          successToast(responseData.message || 'OTP sent to your email');
          // Start resend timer
          setResendTimer(60);
          const timer = setInterval(() => {
            setResendTimer(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          // Password reset successful
          successToast(responseData.message || 'Password reset successful!');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } else {
        errorToast(responseData.error || responseData.message || 'Something went wrong');
      }
    } catch (e) {
      console.error('Error:', e);
      errorToast('Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isLoading) return;
    
    try {
      const apiResponse = await fetch(requestOtpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const responseData = await apiResponse.json();
      
      if (apiResponse.ok) {
        successToast(responseData.message || 'OTP resent successfully');
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        errorToast(responseData.message || 'Failed to resend OTP');
      }
    } catch (error) {
      errorToast('Error resending OTP');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-400';
    if (passwordStrength <= 50) return 'bg-orange-400';
    if (passwordStrength <= 75) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const doPasswordsMatch = formData.password && formData.confirmPassword 
    ? formData.password === formData.confirmPassword 
    : null;

  const isFormValid = () => {
    if (!isOtpSent) {
      return formData.email.trim() !== '';
    }
    return (
      formData.email.trim() !== '' &&
      formData.resetCode.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 8
    );
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
                {isOtpSent ? (
                  <Lock className="w-5 h-5 text-blue-600" />
                ) : (
                  <KeyRound className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {isOtpSent ? 'Reset Password' : 'Forgot Password?'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {isOtpSent 
                    ? 'Enter the OTP and your new password'
                    : 'We\'ll send a code to reset your password'
                  }
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Email Field - Always Visible */}
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  disabled={isOtpSent && isLoading} 
                />
              </div>
            </div>

            {/* OTP Field - Only when OTP is sent */}
            {isOtpSent && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  OTP Code <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="resetCode"
                    value={formData.resetCode}
                    onChange={handleChange}
                    required
                    placeholder="Enter 5-digit code"
                    maxLength={5}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>
                
                {/* Resend Code Link */}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Didn't receive code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                  </button>
                </div>
              </div>
            )}

            {/* Password Fields - Only when OTP is sent */}
            {isOtpSent && (
              <>
                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                    New Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.password ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.password ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                passwordStrength >= level * 25 
                                  ? getStrengthColor() 
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-gray-500 ml-2">
                          {getStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    
                    {/* Password Match Indicator */}
                    {doPasswordsMatch !== null && (
                      <div className="absolute inset-y-0 right-12 flex items-center">
                        {doPasswordsMatch ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {doPasswordsMatch === false && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full mt-6 relative py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors disabled:bg-blue-500 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isOtpSent ? 'Resetting...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    {isOtpSent ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Reset Password</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send OTP</span>
                      </>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-xs text-gray-500 pt-2">
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to login
              </a>
            </p>

            {/* Step Indicator */}
            <div className="flex justify-center gap-2 pt-2">
              <div className={`h-1 w-12 rounded-full ${!isOtpSent ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`h-1 w-12 rounded-full ${isOtpSent ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>
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

export default ForgotPasswordPage