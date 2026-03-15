"use client"

import { baseUrL } from '@/env/URLs';
import { useEmailFromStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation'
import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { 
    Mail, 
    KeyRound, 
    ArrowRight, 
    RefreshCw,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface VerifyOTPResponse {
  message: string;
  success: boolean;
}

const VerifyOTPPage = () => {
    const [otp, setOtp] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(0);
    const email = useEmailFromStorage();
    const verifyUrl = `${baseUrL}/validateEmailCode`;
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        const value = e.target.value;

        // Allow only numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = inputRefs.current.map((input, i) => 
            i === index ? value : input?.value || ''
        ).join('');
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
        if (e.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.replace(/\D/g, '').slice(0, 5);
        
        if (numbers.length === 5) {
            setOtp(numbers);
            numbers.split('').forEach((digit, index) => {
                if (inputRefs.current[index]) {
                    inputRefs.current[index]!.value = digit;
                }
            });
            inputRefs.current[4]?.focus();
        }
    };

    const handleVerify = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!email) {
            setMessage('Email not found. Please try again.');
            return;
        }

        if (otp.length !== 5) {
            setMessage('Please enter the complete 5-digit OTP.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const res = await fetch(verifyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verificationCode: otp, email }),
            });

            const data: VerifyOTPResponse = await res.json();
            
            if (res.ok) {
                setMessage(data.message || 'Email verified successfully!');
                setTimeout(() => {
                    router.push('/signup');
                }, 2000);
            } else {
                setMessage(data.message || 'Invalid verification code');
            }

        } catch (error) {
            console.error('Error verifying OTP:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return;
        
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

        // Add your resend API call here
        try {
            // await fetch(`${baseUrL}/resend-verification-code`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email }),
            // });
            console.log('Resending code to:', email);
        } catch (error) {
            console.error('Error resending code:', error);
        }
    };

    const isOtpComplete = otp.length === 5;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-md w-full mx-auto">
                {/* Simple white card with very light blue shadow */}
                <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50/50 overflow-hidden">
                    
                    {/* Minimalist header with very light blue */}
                    <div className="bg-blue-50/30 px-6 sm:px-8 py-5 border-b border-blue-100/50">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-100/50 rounded-lg">
                                <KeyRound className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Verify Your Email</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Enter the 5-digit code sent to your email</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleVerify} className="p-6 sm:p-8 space-y-6">
                        {/* Email Display */}
                        {email && (
                            <div className="bg-teal-50/50 rounded-lg p-3 border border-teal-100/50">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm text-gray-600">Code sent to:</span>
                                    <span className="text-sm font-medium text-gray-800">{email}</span>
                                </div>
                            </div>
                        )}

                        {/* OTP Input Fields */}
                        <div className="space-y-3">
                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Verification Code <span className="text-red-400">*</span>
                            </label>
                            <div className="flex justify-center gap-2 sm:gap-3">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 text-center">
                                Enter the 5-digit code from your email
                            </p>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${
                                message.includes('successfully') || message.includes('Success')
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {message.includes('successfully') || message.includes('Success') ? (
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                )}
                                <span className="text-sm">{message}</span>
                            </div>
                        )}

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={!isOtpComplete || isLoading || !email}
                            className="w-full relative py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors disabled:bg-teal-500 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Verify Email</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </span>
                        </button>

                        {/* Resend Code Link */}
                        <div className="text-center space-y-2">
                            <p className="text-xs text-gray-500">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={resendTimer > 0 || isLoading}
                                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1"
                                >
                                    <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                                    Resend
                                </button>
                            </p>
                            {resendTimer > 0 && (
                                <p className="text-xs text-gray-400">
                                    Resend available in {resendTimer} seconds
                                </p>
                            )}
                        </div>

                        {/* Back to Login Link */}
                        <p className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                            <a 
                                href="/login" 
                                className="text-gray-500 hover:text-teal-600 transition-colors"
                            >
                                ← Back to login
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
    );
};

export default VerifyOTPPage;