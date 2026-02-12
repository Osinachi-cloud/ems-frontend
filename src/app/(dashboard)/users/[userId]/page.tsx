"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Loader2, ArrowLeft, Home, UsersRound, User as UserIcon, Mail, Phone, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { baseUrL } from '@/env/URLs';
import { UserDto } from '@/types/reponse';

interface DetailedUserView {
    user: UserDto;
    landlord?: UserDto;
    tenants: UserDto[];
    occupants: UserDto[];
    allRelatedUsers: UserDto[];
    statistics?: {
        totalTenants: number;
        totalOccupants: number;
        totalProperties?: number;
        activeLeases?: number;
    };
}

export default function UserDetailsPage({ params }: { params: { userId: string } }) {
    const router = useRouter();
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        tenants: true,
        occupants: true,
        landlord: true
    });

    const {
        data: userDetailsResponse,
        isLoading,
        error,
        callApi: fetchUserDetails
    } = useFetch("GET", null, `${baseUrL}/get-user-detailed-view?userId=${params.userId}`);

    useEffect(() => {
        fetchUserDetails();
    }, [params.userId]);

    const detailedViewData: DetailedUserView = userDetailsResponse?.data;

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getStatusPill = (enabled: boolean) => enabled
        ? { label: 'Active', classes: 'bg-green-100 text-green-800' }
        : { label: 'Inactive', classes: 'bg-red-100 text-red-800' };

    const handleViewUser = (userId: string) => {
        router.push(`/users/${userId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                    <span className="ml-2 text-gray-600">Loading user details...</span>
                </div>
            </div>
        );
    }

    if (error || !detailedViewData) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading User</h2>
                    <p className="text-red-600">{error || 'User not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { user, landlord, tenants, occupants } = detailedViewData;
    const status = getStatusPill(user.enabled);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <Users className="w-6 h-6 text-teal-600" />
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Profile</h1>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.classes}`}>
                            {status.label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main User Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div 
                                className="rounded-full w-20 h-20 sm:w-24 sm:h-24 text-white flex justify-center items-center text-3xl sm:text-4xl font-bold shadow-lg"
                                style={{ backgroundColor: "#" + user.userId.slice(1, 7) }}
                            >
                                {user.firstName?.slice(0, 1).toUpperCase()}
                                {user.lastName?.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                                                {user.role?.name || 'No Role'}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {user.designation}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="text-sm text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="text-sm text-gray-900">{user.phoneNumber || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Member Since</p>
                                    <p className="text-sm text-gray-900">
                                        {user.dateCreated ? new Date(user.dateCreated).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">User ID</p>
                                    <p className="text-sm font-mono text-gray-900">{user.userId}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Estate ID</p>
                                    <p className="text-sm text-gray-900">{user.estate || 'N/A'}</p>
                                </div>
                            </div>
                            {user.country && (
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Country</p>
                                        <p className="text-sm text-gray-900">{user.country}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Landlord Section (if user is tenant or occupant) */}
                {landlord && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div 
                            className="bg-amber-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors"
                            onClick={() => toggleSection('landlord')}
                        >
                            <div className="flex items-center space-x-3">
                                <Home className="w-5 h-5 text-amber-600" />
                                <h3 className="font-semibold text-gray-800">Landlord / Property Owner</h3>
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                    1
                                </span>
                            </div>
                            {expandedSections.landlord ? 
                                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            }
                        </div>
                        {expandedSections.landlord && (
                            <div className="p-6">
                                <UserCard user={landlord} onView={handleViewUser} />
                            </div>
                        )}
                    </div>
                )}

                {/* Tenants Section (if user is Landlord) */}
                {tenants && tenants.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div 
                            className="bg-purple-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-purple-100/50 transition-colors"
                            onClick={() => toggleSection('tenants')}
                        >
                            <div className="flex items-center space-x-3">
                                <UsersRound className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-800">Tenants</h3>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                    {tenants.length}
                                </span>
                            </div>
                            {expandedSections.tenants ? 
                                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            }
                        </div>
                        {expandedSections.tenants && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tenants.map(tenant => (
                                    <UserCard key={tenant.userId} user={tenant} onView={handleViewUser} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Occupants Section (if user is Tenant) */}
                {occupants && occupants.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div 
                            className="bg-teal-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-teal-100/50 transition-colors"
                            onClick={() => toggleSection('occupants')}
                        >
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-5 h-5 text-teal-600" />
                                <h3 className="font-semibold text-gray-800">Occupants / Family Members</h3>
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                    {occupants.length}
                                </span>
                            </div>
                            {expandedSections.occupants ? 
                                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            }
                        </div>
                        {expandedSections.occupants && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {occupants.map(occupant => (
                                    <UserCard key={occupant.userId} user={occupant} onView={handleViewUser} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* No Related Users */}
                {!landlord && (!tenants || tenants.length === 0) && (!occupants || occupants.length === 0) && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Related Users</h3>
                        <p className="text-gray-500">
                            This user has no tenants, occupants, or landlord associated with them.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// User Card Component
function UserCard({ user, onView }: { user: UserDto; onView: (userId: string) => void }) {
    const status = user.enabled 
        ? { label: 'Active', classes: 'bg-green-100 text-green-800' }
        : { label: 'Inactive', classes: 'bg-red-100 text-red-800' };

    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
                <div 
                    className="rounded-full w-12 h-12 text-white flex justify-center items-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "#" + user.userId.slice(1, 7) }}
                >
                    {user.firstName?.slice(0, 1).toUpperCase()}
                    {user.lastName?.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                        </p>
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${status.classes}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        <span className="inline-flex items-center mr-3">
                            <UserIcon className="w-3 h-3 mr-1" />
                            {user.role?.name || 'N/A'}
                        </span>
                        <span className="inline-flex items-center">
                            {user.designation}
                        </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-400">
                            ID: {user.userId.slice(0, 12)}...
                        </p>
                        <button
                            onClick={() => onView(user.userId)}
                            className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center"
                        >
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}