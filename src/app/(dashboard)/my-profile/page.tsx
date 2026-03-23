// "use client";
// import { formatNumberToNaira } from "@/app/utils/moneyUtils";
// import { baseUrL } from "@/env/URLs";
// import { useFetch } from "@/hooks/useFetch";
// import { Shield, UserCheck, Users, X } from "lucide-react";
// import { useMemo, useState } from "react";
// import { createPortal } from "react-dom"; // Import createPortal for true modal overlay

// // --- MODAL COMPONENT (Defined Outside MyProfile for Clarity) ---
// const UserDetailModal = ({ user, onClose }: any) => {
//     if (!user) return null;

//     // Use a portal to render the modal outside the main component's DOM flow
//     // for correct z-index and overlay behavior
//     if (typeof document === 'undefined') return null; // Server-side check

//     return createPortal(
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
//             onClick={onClose} // Close when clicking the overlay
//         >
//             <div
//                 className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 transform transition-all duration-300 scale-100 opacity-100"
//                 onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//             >
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center border-b pb-3 mb-4">
//                     <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
//                         User Details
//                     </h2>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-400 hover:text-gray-600 transition"
//                         aria-label="Close modal"
//                     >
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 {/* User Info */}
//                 <div className="space-y-4 text-gray-700">
//                     <p className="text-xl font-extrabold">{user.firstName + " " + user.lastName} </p>
//                     <span className={`px-3 py-1 text-sm font-bold rounded-full inline-block ${user.designation === 'TENANT' ? 'bg-green-500 text-white' : user.designation === 'OCCUPANT' && 'bg-yellow-500 text-white'}`}>
//                         {user.designation}
//                     </span>

//                     <div className="flex justify-between">
//                         <div>
//                             <span className="text-[12px] font-bold">Last Paid: </span>
//                             <span>{user.lastPaid}</span>
//                         </div>
//                         <div>
//                             <span className="text-[12px] font-bold">Amount Paid in Current year: </span>
//                             <span>{formatNumberToNaira(user.amountPaid)}</span>
//                         </div>
//                     </div>

//                     <div className="border-t pt-4 space-y-3">
//                         <DetailItem label="ID" value={user.userId} mono />
//                         <DetailItem label="Email" value={user.email} />
//                         <DetailItem label="Estate ID" value={user.estate} />
//                         {user.landlordId && <DetailItem label="Managed by Landlord ID" value={user.landlordId} mono />}
//                         {user.tenantId && <DetailItem label="Under Tenant ID" value={user.tenantId} mono />}
//                     </div>
//                 </div>
//             </div>
//         </div>,
//         document.body
//     );
// };

// // Helper component for cleaner display
// const DetailItem = ({ label, value, mono = false }: any) => (
//     <div>
//         <p className="text-xs uppercase text-gray-500 mb-0.5">{label}</p>
//         <p className={`font-semibold ${mono ? 'font-mono text-sm bg-gray-100 p-2 rounded break-all' : 'text-base'}`}>{value || 'N/A'}</p>
//     </div>
// );


// export default function MyProfile() {
//     // MOCK DATA is unchanged
//     const MOCK_USERS_DATA = [
//         // Super Admins
//         { id: 'sa-001', name: 'Alex SuperAdmin', role: 'SuperAdmin', email: 'sa@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//         // Admins
//         { id: 'ad-001', name: 'Ben Finance Admin', role: 'Admin', email: 'ad@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//         // Landlords
//         { id: 'll-001', name: 'Chris Landlord', role: 'Landlord', email: 'll@app.com', landlordId: "t-001", tenantId: null, estateId: 'E001' },
//         { id: 'll-002', name: 'Dana Landlord', role: 'Landlord', email: 'll2@app.com', landlordId: "t-001", tenantId: null, estateId: 'E001' },
//         // Tenants (under ll-001)/
//         { id: 't-001', name: 'Ethan Tenant', role: 'Tenant', email: 't1@app.com', landlordId: 'll-001', tenantId: "1", estateId: 'E001' },
//         { id: 't-002', name: 'Fiona Tenant', role: 'Tenant', email: 't2@app.com', landlordId: 'll-001', tenantId: "1", estateId: 'E001' },
//         // Occupants (under t-001, belonging to ll-001)
//         { id: 'o-001', name: 'Gary Occupant', role: 'Occupant', email: 'o1@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
//         { id: 'o-002', name: 'Hannah Occupant', role: 'Occupant', email: 'o2@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
//     ];

//     const {
//         data: userData,
//         isLoading: userDetailsLoading,
//         error: userDetailError,
//         callApi: refetchUserDetailNavbar
//     } = useFetch("GET", null, `${baseUrL}/customer-details?email=appadmin@ems.com`);

//     const currentUserProfile = userData?.data;
//     const [userProfile, setUserProfile] = useState(MOCK_USERS_DATA[2]);
//     const currentUserId = currentUserProfile?.userId;

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedUserDetail, setSelectedUserDetail] = useState(null);

//     const openModal = (user: any) => {
//         setSelectedUserDetail(user);
//         setIsModalOpen(true);
//     }

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedUserDetail(null);
//     }

//     return (
//         <div className="p-6 bg-gray-100 flex-grow rounded-lg min-h-screen">
//             <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">My Profile & Hierarchy</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//                 {/* 1. Main Profile Details (Left Column) */}
//                 <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500 h-fit">
//                     <div className="flex items-center space-x-4 mb-6">
//                         <UserCheck className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//                         <div>
//                             <p className="text-2xl font-bold text-gray-900">{currentUserProfile?.firstName || 'User Name'}</p>
//                             <p className="text-sm font-semibold text-yellow-600">{currentUserProfile?.role?.name}</p>
//                         </div>
//                     </div>

//                     <div className="space-y-4 text-gray-700">
//                         <div className="border-b pb-3">
//                             <p className="text-xs uppercase text-gray-500 mb-1">Unique Identifier</p>
//                             <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{currentUserId}</p>
//                         </div>
//                         <div className="border-b pb-3">
//                             <p className="text-xs uppercase text-gray-500 mb-1">Primary Email (Mock)</p>
//                             <p className="font-semibold">{userData?.data?.email || 'N/A'}</p>
//                         </div>
//                         <div className="border-b pb-3">
//                             <p className="text-xs uppercase text-gray-500 mb-1">Estate</p>
//                             <p className="font-semibold">{currentUserProfile?.estate || 'N/A'}</p>
//                         </div>

//                         {/* Relationship Details */}
//                         {
//                             <div className="pt-2">
//                                 <p className="text-xs uppercase text-gray-500 mb-2">My Direct Relationships</p>
//                                 {currentUserProfile?.landlordId && (
//                                     <div className="flex items-center space-x-2 text-sm">
//                                         <Shield className="w-4 h-4 text-purple-500" />
//                                         <p><strong>Landlord:</strong> <span className="font-mono text-gray-600">{currentUserProfile.landlordId}</span></p>
//                                     </div>
//                                 )}
//                                 {currentUserProfile?.tenantId && (
//                                     <div className="flex items-center space-x-2 text-sm">
//                                         <Users className="w-4 h-4 text-blue-500" />
//                                         <p><strong>Tenant:</strong> <span className="font-mono text-gray-600">{currentUserProfile.tenantId}</span> (My Manager)</p>
//                                     </div>
//                                 )}
//                             </div>
//                         }
//                     </div>
//                 </div>

//                 {/* 2. Subordinate Users List (Right Column) */}
//                 {(currentUserProfile?.subUsersList && currentUserProfile.subUsersList.length > 0) ? (
//                     <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500">
//                         <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                             <Users className="w-6 h-6 mr-3 text-blue-600" />
//                             Subordinate Users ({currentUserProfile?.subUsersList?.length})
//                         </h3>
//                         <p className="text-sm text-gray-600 mb-4">
//                             {currentUserProfile.designation === 'Landlord'
//                                 ? 'This list includes all your direct Tenants and the Occupants managed by those Tenants.'
//                                 : 'This list includes all Occupants registered under your tenancy.'}
//                         </p>

//                         {currentUserProfile?.subUsersList?.length > 0 ? (
//                             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
//                                 {currentUserProfile?.subUsersList?.map((sub: any) => (
//                                     <div
//                                         key={sub.userId}
//                                         className={`p-4 rounded-lg shadow-md border transition transform hover:scale-[1.01] cursor-pointer ${sub.designation === 'Tenant' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}
//                                     >
//                                         <div className="flex justify-between items-center mb-1">
//                                             <p className="font-semibold text-lg">{sub.firstName + " "}   {sub.lastName}</p>

//                                             {/* --- MODAL TRIGGER: The span is now a button-like element --- */}
//                                             <span
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); // Prevent any parent click handlers
//                                                     openModal(sub); // Open modal with this user's details
//                                                 }}
//                                                 className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition hover:opacity-80 ${sub.designation === 'TENANT' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
//                                                 role="button"
//                                                 aria-label={`View details for ${sub.name}`}
//                                             >
//                                                 {sub.designation}
//                                             </span>

//                                         </div>
//                                         <p className="text-sm text-gray-500">Email: {sub.email}</p>
//                                         <p className="text-xs text-gray-400">ID: {sub.userId}</p>
//                                         {sub.tenantId && <p className="text-xs text-gray-500 mt-1">Managed by Tenant: {sub.tenantId}</p>}

//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-10 bg-gray-50 border rounded-lg text-gray-500">
//                                 <p className="text-xl">No Subordinate Users Found</p>
//                                 <p className="text-sm mt-2">Check the Role Simulation on the Dashboard to ensure you are a Landlord or Tenant with assigned subordinates.</p>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="lg:col-span-2 p-6 bg-white border border-dashed border-gray-300 rounded-xl text-center flex items-center justify-center">
//                         <p className="text-xl text-gray-500">
//                             <Shield className="inline-block w-5 h-5 mr-2" />
//                             As an **{currentUserProfile?.designation}**, you do not manage other users in the hierarchy.
//                         </p>
//                     </div>
//                 )}
//             </div>

//             {/* --- MODAL RENDERING --- */}
//             {isModalOpen && <UserDetailModal user={selectedUserDetail} onClose={closeModal} />}
//             {/* ----------------------- */}
//         </div>
//     );
// };




























"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Loader2, ArrowLeft, Home, UsersRound, User as UserIcon, Mail, Phone, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { baseUrL } from '@/env/URLs';
import { UserDto } from '@/types/reponse';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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

export default function UserDetailsPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        tenants: true,
        occupants: true,
        landlord: true
    });

    const { getUserDetails } = useLocalStorage("userDetails", null);

    // Get userId ONLY from localStorage userDetails
    useEffect(() => {
        const getUserIdFromStorage = async () => {
            try {
                // Get user details from localStorage
                const userDetails = getUserDetails();
                const customerId = userDetails?.customerId;
                
                if (customerId) {
                    console.log('Using customerId from localStorage:', customerId);
                    setUserId(customerId);
                } else {
                    console.error('No customerId found in localStorage');
                    setApiError('User not authenticated. Please log in again.');
                }
            } catch (error) {
                console.error('Error getting userId:', error);
                setApiError('Failed to get user ID. Please log in again.');
            }
        };

        getUserIdFromStorage();
    }, [getUserDetails]);

    const {
        data: userDetailsResponse,
        isLoading,
        error: fetchError,
        callApi: fetchUserDetails,
    } = useFetch("GET", null, userId ? `${baseUrL}/get-user-detailed-view?userId=${userId}` : "");

    // Log the response for debugging
    useEffect(() => {
        if (userDetailsResponse) {
            console.log('API Response:', userDetailsResponse);
        }
        if (fetchError) {
            console.error('Fetch Error:', fetchError);
            setApiError(typeof fetchError === 'string' ? fetchError : 'Failed to fetch user details');
        }
    }, [userDetailsResponse, fetchError]);

    // Safely access data with validation
    const detailedViewData: DetailedUserView | null = React.useMemo(() => {
        if (!userDetailsResponse?.data) return null;
        
        // Validate the data structure
        const data = userDetailsResponse.data;
        if (!data.user) {
            console.error('Invalid data structure:', data);
            setApiError('Invalid response format');
            return null;
        }
        
        return data;
    }, [userDetailsResponse]);

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

    const handleRetry = () => {
        setApiError(null);
        if (userId) {
            fetchUserDetails();
        } else {
            // Try to get userId again
            const userDetails = getUserDetails();
            const customerId = userDetails?.customerId;
            if (customerId) {
                setUserId(customerId);
            } else {
                setApiError('User not authenticated. Please log in again.');
            }
        }
    };

    // Show loading while getting userId
    if (!userId && !apiError) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading user profile...</span>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading user details...</span>
                </div>
            </div>
        );
    }

    if (apiError || fetchError || !detailedViewData) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading User</h2>
                    <p className="text-red-600 mb-4">{apiError || fetchError || 'User not found'}</p>
                    {userId && <p className="text-sm text-gray-600 mb-4">User ID: {userId}</p>}
                    <p className="text-sm text-gray-600 mb-4">API URL: {baseUrL}/get-user-detailed-view?userId={userId}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { user, landlord, tenants, occupants } = detailedViewData;
    
    // Additional validation for user object
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Invalid User Data</h2>
                    <p className="text-red-600">User object is missing from response</p>
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
                                <Users className="w-6 h-6 text-blue-600" />
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
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
                    <div className="bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div 
                                className="rounded-full w-20 h-20 sm:w-24 sm:h-24 text-white flex justify-center items-center text-3xl sm:text-4xl font-bold shadow-lg"
                                style={{ backgroundColor: user.userId ? "#" + user.userId.slice(1, 7) : '#cccccc' }}
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
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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

                {/* Landlord Section */}
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

                {/* Tenants Section */}
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

                {/* Occupants Section */}
                {occupants && occupants.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div 
                            className="bg-blue-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-blue-100/50 transition-colors"
                            onClick={() => toggleSection('occupants')}
                        >
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-800">Occupants / Family Members</h3>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
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
                    style={{ backgroundColor: user.userId ? "#" + user.userId.slice(1, 7) : '#cccccc' }}
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
                            ID: {user.userId?.slice(0, 12)}...
                        </p>
                        <button
                            onClick={() => onView(user.userId)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}