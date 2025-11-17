"use client";
import { Shield, UserCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";

export default function MyProfile() {


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

    const [userId, setUserId] = useState(MOCK_USERS_DATA[4].id);

    const [userProfile, setUserProfile] = useState(MOCK_USERS_DATA[2]);
    const [allMockUsers, setAllMockUsers] = useState(MOCK_USERS_DATA);


    const filteredUsers = useMemo(() => {
        if (!userProfile) return [];

        const role = userProfile.role;

        if (role === 'SuperAdmin' || role === 'Admin') {
            // Admins see everyone
            return allMockUsers;
        } else if (role === 'Landlord') {
            // Landlord sees themselves, their direct tenants, and occupants under those tenants
            const tenantIds = allMockUsers
                .filter(u => u.landlordId === userId && u.role === 'Tenant')
                .map(u => u.id);

            return allMockUsers.filter(u =>
                u.id === userId ||
                u.landlordId === userId || // Direct tenants and occupants
                tenantIds.includes(u.tenantId === null ? "" : u.tenantId) // Occupants whose tenant belongs to this landlord
            );
        } else if (role === 'Tenant') {
            // Tenant sees themselves and their direct occupants
            return allMockUsers.filter(u => u.id === userId || u.tenantId === userId);
        } else if (role === 'Occupant') {
            // Occupants only see themselves
            return allMockUsers.filter(u => u.id === userId);
        }
        return [];
    }, [allMockUsers, userId, userProfile]);


    // Users subordinate to the current user (Tenants/Occupants for Landlord; Occupants for Tenant)
    const subordinates = filteredUsers.filter(u => u.id !== userId);

    return (
        <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">My Profile & Hierarchy</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Main Profile Details (Left Column) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl border-t-4 border-teal-500 h-fit">
                    <div className="flex items-center space-x-4 mb-6">
                        <UserCheck className="w-10 h-10 text-teal-600 bg-teal-100 p-2 rounded-full" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{userProfile?.name || 'User Name'}</p>
                            <p className="text-sm font-semibold text-yellow-600">{userProfile?.role}</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-gray-700">
                        <div className="border-b pb-3">
                            <p className="text-xs uppercase text-gray-500 mb-1">Unique Identifier</p>
                            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{userId}</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-xs uppercase text-gray-500 mb-1">Primary Email (Mock)</p>
                            <p className="font-semibold">{userProfile?.email || 'N/A'}</p>
                        </div>
                        <div className="border-b pb-3">
                            <p className="text-xs uppercase text-gray-500 mb-1">Estate</p>
                            <p className="font-semibold">{userProfile?.estateId || 'N/A'}</p>
                        </div>

                        {/* Relationship Details */}
                        {(userProfile?.landlordId || userProfile?.tenantId) && (
                            <div className="pt-2">
                                <p className="text-xs uppercase text-gray-500 mb-2">My Direct Relationships</p>
                                {userProfile?.landlordId && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Shield className="w-4 h-4 text-purple-500" />
                                        <p><strong>Landlord:</strong> <span className="font-mono text-gray-600">{userProfile.landlordId}</span></p>
                                    </div>
                                )}
                                {userProfile?.tenantId && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <p><strong>Tenant:</strong> <span className="font-mono text-gray-600">{userProfile.tenantId}</span> (My Manager)</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Subordinate Users List (Right Column) */}
                {(userProfile?.role === 'Landlord' || userProfile?.role === 'Tenant') ? (
                    <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <Users className="w-6 h-6 mr-3 text-teal-600" />
                            Subordinate Users ({subordinates.length})
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {userProfile.role === 'Landlord'
                                ? 'This list includes all your direct Tenants and the Occupants managed by those Tenants.'
                                : 'This list includes all Occupants registered under your tenancy.'}
                        </p>

                        {subordinates.length > 0 ? (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {subordinates.map(sub => (
                                    <div
                                        key={sub.id}
                                        className={`p-4 rounded-lg shadow-md transition transform hover:scale-[1.01] ${sub.role === 'Tenant' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-lg">{sub.name}</p>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${sub.role === 'Tenant' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                                                {sub.role}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">Email: {sub.email}</p>
                                        <p className="text-xs text-gray-400">ID: {sub.id}</p>
                                        {sub.tenantId && <p className="text-xs text-gray-500 mt-1">Managed by Tenant: {sub.tenantId}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
                                <p className="text-xl">No Subordinate Users Found</p>
                                <p className="text-sm mt-2">Check the Role Simulation on the Dashboard to ensure you are a Landlord or Tenant with assigned subordinates.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="lg:col-span-2 p-6 bg-white border border-dashed border-gray-300 rounded-xl text-center flex items-center justify-center">
                        <p className="text-xl text-gray-500">
                            <Shield className="inline-block w-5 h-5 mr-2" />
                            As an **{userProfile?.role}**, you do not manage other users in the hierarchy.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};



