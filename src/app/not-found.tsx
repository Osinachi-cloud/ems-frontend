// app/not-found.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    Home, 
    ArrowLeft, 
    Search, 
    FileQuestion, 
    Compass,
    TrendingUp,
    Users,
    DollarSign,
    Menu
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const router = useRouter();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Disable mouse parallax on mobile
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMobile) return;
        setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * 20,
            y: (e.clientY / window.innerHeight - 0.5) * 20
        });
    };

    // Quick navigation suggestions
    const quickLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'teal' },
        { href: '/users', label: 'Users', icon: Users, color: 'blue' },
        { href: '/transactions', label: 'Transactions', icon: TrendingUp, color: 'green' },
        { href: '/financial-reports', label: 'Reports', icon: DollarSign, color: 'purple' },
    ];

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-3 sm:p-4 relative overflow-y-auto"
            onMouseMove={handleMouseMove}
        >
            {/* Simplified Background for Mobile */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Numbers - Smaller on mobile */}
                <div 
                    className="absolute text-[120px] sm:text-[200px] md:text-[300px] font-black text-teal-100/20 select-none"
                    style={{
                        transform: !isMobile ? `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` : 'none',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-60px',
                        marginTop: '-60px',
                        animation: 'float 20s ease-in-out infinite'
                    }}
                >
                    404
                </div>

                {/* Animated Circles - Reduced opacity on mobile */}
                <div className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-teal-200/20 sm:bg-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-200/20 sm:bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content Card */}
            <div 
                className="relative bg-white/90 sm:bg-white/80 backdrop-blur-md sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/50 p-5 sm:p-8 md:p-12 max-w-2xl w-full mx-auto transition-all duration-500"
                style={!isMobile ? {
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
                } : {}}
            >
                {/* Decorative Header - Adjusted for mobile */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-auto">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg flex items-center justify-center space-x-1 sm:space-x-2">
                        <Compass className="w-3 h-3 sm:w-4 sm:h-4 animate-spin-slow" />
                        <span>Page Not Found</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="text-center mt-6 sm:mt-8">
                    {/* Animated 404 Display - Responsive sizing */}
                    <div className="relative mb-4 sm:mb-8">
                        <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                            {['4', '0', '4'].map((digit, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    style={{
                                        animation: !isMobile ? `bounce-${index} 2s ease-in-out infinite` : 'none',
                                        animationDelay: `${index * 0.2}s`
                                    }}
                                >
                                    <div className="text-6xl sm:text-8xl md:text-9xl font-black bg-gradient-to-b from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                        {digit}
                                    </div>
                                    <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-xl -z-10"></div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Status Badge - Adjusted for mobile */}
                        <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <span className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg flex items-center space-x-1 sm:space-x-2">
                                <FileQuestion className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>HTTP 404</span>
                            </span>
                        </div>
                    </div>

                    {/* Error Message - Responsive text */}
                    <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 mt-8 sm:mt-12">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-8 px-2">
                        The page you're looking for seems to have vanished into thin air.
                    </p>

                    {/* Search Suggestion - Mobile optimized */}
                    <div className="bg-gray-50/90 sm:bg-gray-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-8 border border-gray-200/50">
                        <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 mb-2 sm:mb-3">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium">Quick Links</span>
                        </div>
                        
                        {/* Quick Links - Grid layout for mobile */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center">
                            {quickLinks.map((link) => {
                                const Icon = link.icon;
                                const colorClasses = {
                                    teal: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200',
                                    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
                                    green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
                                    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
                                }[link.color];

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`inline-flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border ${colorClasses} transition-all duration-300 hover:scale-105 text-xs sm:text-sm font-medium`}
                                    >
                                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="truncate">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons - Stacked on mobile */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 transition-all duration-300 hover:shadow-lg text-sm sm:text-base font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Go Back</span>
                        </button>
                        
                        <Link
                            href="/"
                            className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 hover:shadow-lg hover:shadow-teal-200 text-sm sm:text-base font-medium"
                        >
                            <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            <span>Return Home</span>
                        </Link>
                    </div>

                    {/* Help Text - Smaller on mobile */}
                    <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-gray-400">
                        If you believe this is a system error, please contact support
                    </p>
                </div>

                {/* Decorative Bottom */}
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(5px, -5px) rotate(2deg); }
                    66% { transform: translate(-5px, 5px) rotate(-2deg); }
                }

                @keyframes bounce-0 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes bounce-1 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes bounce-2 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* Mobile optimizations */
                @media (max-width: 640px) {
                    .backdrop-blur-xl {
                        backdrop-blur: blur(8px);
                    }
                    
                    /* Prevent overflow issues */
                    .min-h-screen {
                        min-height: -webkit-fill-available;
                    }
                }
            `}</style>
        </div>
    );
}