"use client";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { Shield, UserCheck, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom"; // Import createPortal for true modal overlay

// --- MODAL COMPONENT (Defined Outside MyProfile for Clarity) ---
const UserDetailModal = ({ user, onClose }: any) => {
    if (!user) return null;

    // Use a portal to render the modal outside the main component's DOM flow
    // for correct z-index and overlay behavior
    if (typeof document === 'undefined') return null; // Server-side check

    return createPortal(
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={onClose} // Close when clicking the overlay
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 transform transition-all duration-300 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <UserCheck className="w-6 h-6 mr-2 text-teal-600" />
                        User Details
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info */}
                <div className="space-y-4 text-gray-700">
                    <p className="text-xl font-extrabold">{user.firstName + " " + user.lastName} </p>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full inline-block ${user.designation === 'TENANT' ? 'bg-green-500 text-white' : user.designation === 'OCCUPANT' && 'bg-yellow-500 text-white'}`}>
                        {user.designation}
                    </span>
                    
                    <div className="border-t pt-4 space-y-3">
                        <DetailItem label="ID" value={user.userId} mono />
                        <DetailItem label="Email" value={user.email} />
                        <DetailItem label="Estate ID" value={user.estate} />
                        {user.landlordId && <DetailItem label="Managed by Landlord ID" value={user.landlordId} mono />}
                        {user.tenantId && <DetailItem label="Under Tenant ID" value={user.tenantId} mono />}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Helper component for cleaner display
const DetailItem = ({ label, value, mono = false }:any) => (
    <div>
        <p className="text-xs uppercase text-gray-500 mb-0.5">{label}</p>
        <p className={`font-semibold ${mono ? 'font-mono text-sm bg-gray-100 p-2 rounded break-all' : 'text-base'}`}>{value || 'N/A'}</p>
    </div>
);


export default function MyProfile() {
    // MOCK DATA is unchanged
    const MOCK_USERS_DATA = [
        // Super Admins
        { id: 'sa-001', name: 'Alex SuperAdmin', role: 'SuperAdmin', email: 'sa@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
        // Admins
        { id: 'ad-001', name: 'Ben Finance Admin', role: 'Admin', email: 'ad@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
        // Landlords
        { id: 'll-001', name: 'Chris Landlord', role: 'Landlord', email: 'll@app.com', landlordId: "t-001", tenantId: null, estateId: 'E001' },
        { id: 'll-002', name: 'Dana Landlord', role: 'Landlord', email: 'll2@app.com', landlordId: "t-001", tenantId: null, estateId: 'E001' },
        // Tenants (under ll-001)/
        { id: 't-001', name: 'Ethan Tenant', role: 'Tenant', email: 't1@app.com', landlordId: 'll-001', tenantId: "1", estateId: 'E001' },
        { id: 't-002', name: 'Fiona Tenant', role: 'Tenant', email: 't2@app.com', landlordId: 'll-001', tenantId: "1", estateId: 'E001' },
        // Occupants (under t-001, belonging to ll-001)
        { id: 'o-001', name: 'Gary Occupant', role: 'Occupant', email: 'o1@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
        { id: 'o-002', name: 'Hannah Occupant', role: 'Occupant', email: 'o2@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
    ];

        const {
        data: userData,
        isLoading: userDetailsLoading,
        error: userDetailError,
        callApi: refetchUserDetailNavbar
    } = useFetch("GET", null, `${baseUrL}/customer-details?email=appadmin@ems.com`);

    const currentUserProfile = userData?.data;
    const [userProfile, setUserProfile] = useState(MOCK_USERS_DATA[2]);
    const currentUserId = currentUserProfile?.userId;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserDetail, setSelectedUserDetail] = useState(null);

    const openModal = (user:any) => {
        setSelectedUserDetail(user);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserDetail(null);
    }

    return (
        <div className="p-6 bg-gray-100 flex-grow rounded-lg min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">My Profile & Hierarchy</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Main Profile Details (Left Column) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl border-t-4 border-teal-500 h-fit">
                    <div className="flex items-center space-x-4 mb-6">
                        <UserCheck className="w-10 h-10 text-teal-600 bg-teal-100 p-2 rounded-full" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{currentUserProfile?.firstName || 'User Name'}</p>
                            <p className="text-sm font-semibold text-yellow-600">{currentUserProfile?.role?.name}</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-gray-700">
                        <div className="border-b pb-3">
                            <p className="text-xs uppercase text-gray-500 mb-1">Unique Identifier</p>
                            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{currentUserId}</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-xs uppercase text-gray-500 mb-1">Primary Email (Mock)</p>
                            <p className="font-semibold">{userData?.data?.email || 'N/A'}</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-xs uppercase text-gray-500 mb-1">Estate</p>
                            <p className="font-semibold">{currentUserProfile?.estate || 'N/A'}</p>
                        </div>

                        {/* Relationship Details */}
                        {
                            <div className="pt-2">
                                <p className="text-xs uppercase text-gray-500 mb-2">My Direct Relationships</p>
                                {currentUserProfile?.landlordId && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Shield className="w-4 h-4 text-purple-500" />
                                        <p><strong>Landlord:</strong> <span className="font-mono text-gray-600">{currentUserProfile.landlordId}</span></p>
                                    </div>
                                )}
                                {currentUserProfile?.tenantId && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <p><strong>Tenant:</strong> <span className="font-mono text-gray-600">{currentUserProfile.tenantId}</span> (My Manager)</p>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </div>

                {/* 2. Subordinate Users List (Right Column) */}
                {(currentUserProfile?.subUsersList && currentUserProfile.subUsersList.length > 0) ? (
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-500">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <Users className="w-6 h-6 mr-3 text-teal-600" />
                            Subordinate Users ({currentUserProfile?.subUsersList?.length})
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {currentUserProfile.designation === 'Landlord'
                                ? 'This list includes all your direct Tenants and the Occupants managed by those Tenants.'
                                : 'This list includes all Occupants registered under your tenancy.'}
                        </p>

                        {currentUserProfile?.subUsersList?.length > 0 ? (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {currentUserProfile?.subUsersList?.map((sub: any) => (
                                    <div
                                        key={sub.userId}
                                        className={`p-4 rounded-lg shadow-md border transition transform hover:scale-[1.01] cursor-pointer ${sub.designation === 'Tenant' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-lg">{sub.firstName + " "}   {sub.lastName}</p>
                                            
                                            {/* --- MODAL TRIGGER: The span is now a button-like element --- */}
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent any parent click handlers
                                                    openModal(sub); // Open modal with this user's details
                                                }}
                                                className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition hover:opacity-80 ${sub.designation === 'TENANT' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
                                                role="button"
                                                aria-label={`View details for ${sub.name}`}
                                            >
                                                {sub.designation}
                                            </span>

                                        </div>
                                        <p className="text-sm text-gray-500">Email: {sub.email}</p>
                                        <p className="text-xs text-gray-400">ID: {sub.userId}</p>
                                        {sub.tenantId && <p className="text-xs text-gray-500 mt-1">Managed by Tenant: {sub.tenantId}</p>}
                                    
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 border rounded-lg text-gray-500">
                                <p className="text-xl">No Subordinate Users Found</p>
                                <p className="text-sm mt-2">Check the Role Simulation on the Dashboard to ensure you are a Landlord or Tenant with assigned subordinates.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="lg:col-span-2 p-6 bg-white border border-dashed border-gray-300 rounded-xl text-center flex items-center justify-center">
                        <p className="text-xl text-gray-500">
                            <Shield className="inline-block w-5 h-5 mr-2" />
                            As an **{currentUserProfile?.designation}**, you do not manage other users in the hierarchy.
                        </p>
                    </div>
                )}
            </div>

            {/* --- MODAL RENDERING --- */}
            {isModalOpen && <UserDetailModal user={selectedUserDetail} onClose={closeModal} />}
            {/* ----------------------- */}
        </div>
    );
};