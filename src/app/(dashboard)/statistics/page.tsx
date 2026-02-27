"use client"


import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import { TransactionTable } from "@/components/TransactionTable";
import UserCard from "@/components/UserCard";
import Image from "next/image";
import { useState } from "react";

const AdminPage = () => {

  const [feeAmount, setFeeAmount] = useState<number>(10)
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8">
        {/* USER CARDS */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome, Alex SuperAdmin!</h1>
          <h6 className="text-xl text-teal-600 mb-4">Role: SuperAdmin</h6>
        </div>
        <div className="grid md:grid-cols-5 gap-2">
          <UserCard country="My Total Paid" customerCount={120000} />
          <UserCard country="Nigeria" customerCount={12} />
          <UserCard country="Canada" customerCount={1000} />
          <UserCard country="China" customerCount={2000} />

          {feeAmount > 0 && (
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg border border-teal-200">
                      <h2 className="text-sm font-semibold text-gray-700 mb-4 whitespace-nowrap">Monthly Fee</h2>
             {/* <p className="mb-4 text-gray-600">Your current monthly fee is <span className="font-bold text-teal-600">${feeAmount}</span> based on your role as a **{"Admin"}**.</p> */}
                      <button
                        onClick={() => console.log("pay")}
                        className="px-6 py-2 bg-teal-600 text-sm text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
                      >
                        Pay {formatNumberToNaira(feeAmount)}
                      </button>
                    </div>
                  )}


          {/* <UserCard country="UK" customerCount={3000} /> */}
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          {/* <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div> */}
          {/* ATTENDANCE CHART */}
          {/* <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div> */}
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[350px] grid md:grid-cols-5 gap-[2rem]">
          <div className="col-span-2 px-[2rem] py-[2rem] h-fit bg-[#fff] rounded-[8px]">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Image src="/trans-icon.png" height={10} width={30} alt="Transaction Icon" />
                <p>Total Transaction</p>
              </div>
              <div>
                <select className="bg-[#F6F8FF]" name="" id="">
                  <option value="">Month</option>
                  <option value="">Year</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-[3rem]">
              <h1 className="text-[40px] font-bold">N5,000,000</h1>
              <Image src="/trans-icon.png" height={50} width={150} alt="Transaction Icon" />
            </div>
          </div>
          <div className="col-span-3">
            <FinanceChart />
          </div>
        </div>
        <div>
          <TransactionTable />
        </div>

      </div>
      {/* RIGHT */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements/>
      </div> */}
    </div>
  );
};

export default AdminPage;









// "use client"
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Home, Users, DollarSign, FileText, UserCheck, Shield } from 'lucide-react';

// // --- MOCK DATA DEFINITIONS ---

// // Define a static list of mock users with their roles and relationships
// const MOCK_USERS_DATA = [
//   // Super Admins
//   { id: 'sa-001', name: 'Alex SuperAdmin', role: 'SuperAdmin', email: 'sa@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   // Admins
//   { id: 'ad-001', name: 'Ben Finance Admin', role: 'Admin', email: 'ad@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   // Landlords
//   { id: 'll-001', name: 'Chris Landlord', role: 'Landlord', email: 'll@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   { id: 'll-002', name: 'Dana Landlord', role: 'Landlord', email: 'll2@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   // Tenants (under ll-001)
//   { id: 't-001', name: 'Ethan Tenant', role: 'Tenant', email: 't1@app.com', landlordId: 'll-001', tenantId: null, estateId: 'E001' },
//   { id: 't-002', name: 'Fiona Tenant', role: 'Tenant', email: 't2@app.com', landlordId: 'll-001', tenantId: null, estateId: 'E001' },
//   // Occupants (under t-001, belonging to ll-001)
//   { id: 'o-001', name: 'Gary Occupant', role: 'Occupant', email: 'o1@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
//   { id: 'o-002', name: 'Hannah Occupant', role: 'Occupant', email: 'o2@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
// ];

// // Define mock transactions
// const MOCK_TRANSACTIONS_DATA = [
//   { id: 'tx1', payerId: 't-001', payerRole: 'Tenant', amount: 100, status: 'Paid', timestamp: new Date(Date.now() - 86400000) },
//   { id: 'tx2', payerId: 'o-001', payerRole: 'Occupant', amount: 50, status: 'Paid', timestamp: new Date(Date.now() - 172800000) },
//   { id: 'tx3', payerId: 't-002', payerRole: 'Tenant', amount: 100, status: 'Unpaid', timestamp: new Date(Date.now() - 345600000) },
//   { id: 'tx4', payerId: 'o-002', payerRole: 'Occupant', amount: 50, status: 'Paid', timestamp: new Date(Date.now() - 500000000) },
//   { id: 'tx5', payerId: 'sa-001', payerRole: 'SuperAdmin', amount: 0, status: 'Exempt', timestamp: new Date(Date.now() - 1000000000) },
// ];

// // --- MAIN APPLICATION COMPONENT ---
// const App = () => {
//   // We mock the user ID (starting with a SuperAdmin)
//   const [userId, setUserId] = useState(MOCK_USERS_DATA[0].id);
//   const [userProfile, setUserProfile] = useState(MOCK_USERS_DATA[0]);
//   const [loading, setLoading] = useState(false); // No backend, so loading is fast
//   const [currentView, setCurrentView] = useState('dashboard');
  
//   // State for all users and transactions (mocked "database")
//   const [allMockUsers, setAllMockUsers] = useState(MOCK_USERS_DATA);
//   const [allMockTransactions, setAllMockTransactions] = useState(MOCK_TRANSACTIONS_DATA);

//   // Available Roles
//   const ROLES = useMemo(() => ['SuperAdmin', 'Admin', 'Landlord', 'Tenant', 'Occupant'], []);

//   // --- MOCK INITIALIZATION (Replaces Firebase setup) ---
//   useEffect(() => {
//     // In a real app, this is where we'd fetch the initial profile data.
//     // Here, we just ensure the initial user is correctly loaded from the mock data.
//     const user = MOCK_USERS_DATA.find(u => u.id === userId);
//     if (user) {
//       setUserProfile(user);
//     }
//   }, [userId]);

//   // --- MOCK DATA FILTERING (Replaces Firestore Queries/onSnapshot) ---

//   const filteredUsers = useMemo(() => {
//     if (!userProfile) return [];

//     const role = userProfile.role;

//     if (role === 'SuperAdmin' || role === 'Admin') {
//       // Admins see everyone
//       return allMockUsers;
//     } else if (role === 'Landlord') {
//       // Landlord sees themselves, their direct tenants, and occupants under those tenants
//       const tenantIds = allMockUsers
//         .filter(u => u.landlordId === userId && u.role === 'Tenant')
//         .map(u => u.id);

//       return allMockUsers.filter(u =>
//         u.id === userId ||
//         u.landlordId === userId || // Direct tenants and occupants
//         tenantIds.includes(u.tenantId == null ? "" : u.tenantId) // Occupants whose tenant belongs to this landlord
//       );
//     } else if (role === 'Tenant') {
//       // Tenant sees themselves and their direct occupants
//       return allMockUsers.filter(u => u.id === userId || u.tenantId === userId);
//     } else if (role === 'Occupant') {
//       // Occupants only see themselves
//       return allMockUsers.filter(u => u.id === userId);
//     }
//     return [];
//   }, [allMockUsers, userId, userProfile]);

//   const filteredTransactions = useMemo(() => {
//     if (!userProfile) return [];

//     const role = userProfile.role;

//     if (role === 'SuperAdmin' || role === 'Admin') {
//       // Admins see all transactions
//       return allMockTransactions;
//     } else if (role === 'Landlord') {
//       // Landlords see transactions of their subordinate users (filteredUsers)
//       const subordinateIds = filteredUsers.map(u => u.id);
//       return allMockTransactions.filter(tx => subordinateIds.includes(tx.payerId));
//     }
//     // Tenant/Occupant: Only see their own transactions
//     return allMockTransactions.filter(tx => tx.payerId === userId);
//   }, [allMockTransactions, userId, userProfile, filteredUsers]);


//   // --- MOCK ROLE MANAGEMENT AND ACTIONS ---
//   const handleRoleChange = (newRole:any) => {
//     // 1. Find the new user profile for the simulation
//     const newProfile = MOCK_USERS_DATA.find(u => u.role === newRole) || userProfile;

//     // 2. Update the active user ID and profile
//     setUserId(newProfile.id);
//     setUserProfile(newProfile);
//     setCurrentView('dashboard');
//     console.log(`Role switched to ${newRole} (Mock ID: ${newProfile.id})`);
//   };

//   const handlePayFee = (feeAmount:any) => {
//     if (!userProfile) return;

//     const newTxId = `tx-${Date.now()}`;
//     const newTransaction = {
//       id: newTxId,
//       payerId: userId,
//       payerRole: userProfile.role,
//       amount: feeAmount,
//       status: 'Paid',
//       timestamp: new Date(),
//       description: `Monthly Fee Payment (${userProfile.role})`,
//     };

//     // Add the new transaction to the mock data state
//     setAllMockTransactions(prev => [newTransaction, ...prev]);
//     console.log('Mock Payment successful. Transaction recorded locally.');
//   };

//   // --- 4. UI Components ---

//   const Sidebar = () => {
//     const navItems = [
//       { name: 'Dashboard', icon: Home, roles: ROLES },
//       { name: 'User Management', icon: Users, roles: ['SuperAdmin', 'Admin'] },
//       { name: 'My Profile', icon: UserCheck, roles: ROLES },
//       { name: 'Transactions', icon: FileText, roles: ROLES },
//     ];

//     return (
//       <div className="w-full lg:w-64 bg-gray-800 text-white flex flex-col p-4 shadow-xl">
//         <div className="mb-8 p-3 text-2xl font-bold text-teal-400 border-b border-gray-700">
//           Estate Management (Mock)
//         </div>
//         <nav className="flex-grow">
//           {navItems.filter(item => item.roles.includes(userProfile?.role)).map((item) => (
//             <button
//               key={item.name}
//               className={`flex items-center w-full px-4 py-3 my-1 rounded-lg transition duration-200 ${currentView === item.name.toLowerCase().replace(/\s/g, '') ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
//               onClick={() => setCurrentView(item.name.toLowerCase().replace(/\s/g, ''))}
//             >
//               <item.icon className="w-5 h-5 mr-3" />
//               <span className="font-medium">{item.name}</span>
//             </button>
//           ))}
//         </nav>
//         <div className="mt-4 pt-4 border-t border-gray-700">
//           <p className="text-sm mb-2 text-gray-400">Current Role:</p>
//           <p className="font-semibold text-lg text-yellow-400">{userProfile?.role}</p>
//           <p className="text-xs text-gray-500 break-words">ID: {userId}</p>
//         </div>
//         <button
//           // Mock Sign Out - reset to initial SuperAdmin state
//           onClick={() => handleRoleChange('SuperAdmin')}
//           className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//         >
//           Reset to SuperAdmin
//         </button>
//       </div>
//     );
//   };

//   const Card = ({ title, value, icon: Icon, colorClass }:any) => (
//     <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colorClass}`}>
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
//         <Icon className="w-6 h-6 text-gray-400" />
//       </div>
//       <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
//     </div>
//   );

//   const DashboardView = () => {
//     const role = userProfile?.role;

//     const getMonthlyFee = () => {
//       switch (role) {
//         case 'SuperAdmin': return 0;
//         case 'Admin': return 50;
//         case 'Landlord': return 200;
//         case 'Tenant': return 100;
//         case 'Occupant': return 50;
//         default: return 0;
//       }
//     };

//     const feeAmount = getMonthlyFee();

//     const stats = useMemo(() => {
//       if (role === 'Landlord') {
//         const tenantCount = allMockUsers.filter(u => u.landlordId === userId && u.role === 'Tenant').length;
//         const unpaidCount = filteredTransactions.filter(tx => tx.status === 'Unpaid').length;
//         return [
//           { title: 'My Tenants', value: tenantCount, icon: Users, color: 'border-blue-500' },
//           { title: 'Outstanding Payments', value: unpaidCount, icon: DollarSign, color: 'border-red-500' },
//           { title: 'My Fee', value: `$${feeAmount}`, icon: DollarSign, color: 'border-teal-500' },
//         ];
//       }
//       if (role === 'Tenant' || role === 'Occupant') {
//         const myTransactions = filteredTransactions.filter(tx => tx.payerId === userId);
//         const paidCount = myTransactions.filter(tx => tx.status === 'Paid').length;
//         const totalPaid = myTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
//         return [
//           { title: 'My Total Paid', value: `$${totalPaid}`, icon: DollarSign, color: 'border-green-500' },
//           { title: 'Payments Count', value: paidCount, icon: FileText, color: 'border-blue-500' },
//           { title: 'Monthly Fee', value: `$${feeAmount}`, icon: DollarSign, color: 'border-teal-500' },
//         ];
//       }
//       return [
//         { title: 'Total Users', value: allMockUsers.length, icon: Users, color: 'border-blue-500' },
//         { title: 'Active Admins', value: allMockUsers.filter(u => u.role.includes('Admin')).length, icon: UserCheck, color: 'border-purple-500' },
//         { title: 'New Transactions', value: filteredTransactions.length, icon: FileText, color: 'border-green-500' },
//       ];
//     }, [role, allMockUsers, filteredTransactions, feeAmount, userId]);


//     return (
//       <div className="p-6 bg-gray-50 flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome, {userProfile?.name}!</h1>
//         <p className="text-xl text-teal-600 mb-8">Role: {role}</p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           {stats.map((stat, index) => (
//             <Card key={index} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
//           ))}
//         </div>

//         {/* Action Section */}
//         {feeAmount > 0 && (
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4">Monthly Fee Payment</h2>
//             <p className="mb-4 text-gray-600">Your current monthly fee is <span className="font-bold text-teal-600">${feeAmount}</span> based on your role as a **{role}**.</p>
//             <button
//               onClick={() => handlePayFee(feeAmount)}
//               className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
//             >
//               Pay Monthly Fee (${feeAmount})
//             </button>
//           </div>
//         )}

//         {/* Role Switcher for Demo */}
//         <div className="mt-10 p-6 bg-yellow-100 border border-yellow-300 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center"><Shield className="w-5 h-5 mr-2" /> Role Simulation (Demo)</h2>
//           <p className="mb-4 text-yellow-700">Switch roles here to test different user permissions and views. This simulates logging in as a different user:</p>
//           <div className="flex flex-wrap gap-3">
//             {ROLES.map((r) => (
//               <button
//                 key={r}
//                 onClick={() => handleRoleChange(r)}
//                 className={`px-4 py-2 text-sm font-medium rounded-full transition ${userProfile?.role === r ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-800 hover:bg-yellow-200 border border-yellow-400'}`}
//               >
//                 Switch to {r}
//               </button>
//             ))}
//           </div>
//           <p className="mt-4 text-xs text-yellow-700">Note: Changing the role also changes your mock User ID to one associated with that role (e.g., Landlord role switches to user 'll-001').</p>
//         </div>
//       </div>
//     );
//   };

//   const UserManagementView = () => {
//     const role = userProfile?.role;

//     return (
//       <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">User Management</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           {role === 'SuperAdmin' ? 'View and manage all users and admins.' :
//             role === 'Admin' ? 'Manage tenants, landlords, and occupants.' :
//               'Role not authorized for full management view.'}
//         </p>

//         <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
//           <div className="flex font-bold text-gray-700 border-b pb-2 mb-2">
//             <div className="w-1/6">Role</div>
//             <div className="w-2/6">Name / ID</div>
//             <div className="w-2/6">Email (Mock)</div>
//             <div className="w-1/6">Relationship</div>
//           </div>
//           <div className="max-h-96 overflow-y-auto">
//             {filteredUsers.map(user => (
//               <div key={user.id} className="flex py-2 border-b border-gray-200 hover:bg-teal-50 transition">
//                 <div className="w-1/6 font-medium text-teal-600">{user.role}</div>
//                 <div className="w-2/6">
//                   <span className="font-semibold">{user.name}</span>
//                   <span className="text-xs block text-gray-500">ID: {user.id}</span>
//                 </div>
//                 <div className="w-2/6 text-gray-600">{user.email}</div>
//                 <div className="w-1/6 text-xs text-gray-500">
//                   {user.landlordId ? `L: ${user.landlordId}` : user.tenantId ? `T: ${user.tenantId}` : 'N/A'}
//                 </div>
//               </div>
//             ))}
//           </div>
//           {filteredUsers.length === 0 && <p className="text-center py-4 text-gray-500">No users found for this role's scope.</p>}
//         </div>
//       </div>
//     );
//   };

//   const TransactionsView = () => {
//     const role = userProfile?.role;
//     const isLandlord = role === 'Landlord';
//     const isPayer = ['Tenant', 'Occupant'].includes(role);

//     return (
//       <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Transaction Details</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           {isLandlord && 'Viewing payment history for your tenants and occupants.'}
//           {isPayer && 'Viewing your personal payment history.'}
//           {['SuperAdmin', 'Admin'].includes(role) && 'Viewing all system transactions.'}
//         </p>

//         <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
//           <div className="hidden sm:flex font-bold text-gray-700 border-b pb-2 mb-2">
//             <div className="w-1/5">Date</div>
//             <div className="w-1/5">Payer ID</div>
//             <div className="w-1/5">Role</div>
//             <div className="w-1/5">Amount</div>
//             <div className="w-1/5">Status</div>
//           </div>
//           <div className="max-h-[70vh] overflow-y-auto">
//             {filteredTransactions.map(tx => (
//               <div key={tx.id} className="flex flex-wrap sm:flex-nowrap py-3 border-b border-gray-200 hover:bg-blue-50 transition">
//                 <div className="w-full sm:w-1/5 text-sm font-medium text-gray-700">
//                   {tx.timestamp?.toLocaleDateString()}
//                 </div>
//                 <div className="w-full sm:w-1/5 text-xs text-gray-500 sm:text-base">{tx.payerId}</div>
//                 <div className="w-full sm:w-1/5 text-xs text-gray-500 sm:text-base">{tx.payerRole}</div>
//                 <div className="w-1/2 sm:w-1/5 font-bold text-green-600">${tx.amount}</div>
//                 <div className="w-1/2 sm:w-1/5">
//                   <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tx.status === 'Paid' ? 'bg-green-100 text-green-800' : tx.status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
//                     {tx.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {filteredTransactions.length === 0 && <p className="text-center py-4 text-gray-500">No transactions found.</p>}
//         </div>
//       </div>
//     );
//   };

//   const MyProfileView = () => (
//     <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
//       <h1 className="text-3xl font-extrabold text-gray-800 mb-6">My Profile Details</h1>
//       <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-t-4 border-teal-500 max-w-lg">
//         <p className="text-2xl font-bold mb-4 text-teal-700">{userProfile?.name || 'User Name'}</p>
//         <div className="space-y-3 text-gray-700">
//           <p><strong>Unique ID:</strong> <span className="text-sm bg-gray-200 p-1 rounded font-mono">{userId}</span></p>
//           <p><strong>Assigned Role:</strong> <span className="font-extrabold text-lg text-yellow-600">{userProfile?.role}</span></p>
//           <p><strong>Estate ID:</strong> {userProfile?.estateId || 'N/A'}</p>
//           {userProfile?.landlordId && <p><strong>My Landlord:</strong> <span className="text-sm bg-gray-200 p-1 rounded font-mono">{userProfile.landlordId}</span></p>}
//           {userProfile?.tenantId && <p><strong>My Tenant (for Occupants):</strong> <span className="text-sm bg-gray-200 p-1 rounded font-mono">{userProfile.tenantId}</span></p>}
//         </div>

//         {(userProfile?.role === 'Landlord' || userProfile?.role === 'Tenant') && (
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">My Subordinates</h3>
//             <ul className="list-disc list-inside ml-2 text-sm space-y-1">
//               {filteredUsers.filter(u => u.id !== userId).map(u => (
//                 <li key={u.id} className="text-gray-600">
//                   {u.name} ({u.role}) - ID: {u.id}
//                 </li>
//               ))}
//               {filteredUsers.length <= 1 && <li className="text-gray-500">No users found under your management.</li>}
//             </ul>
//             <p className="text-xs mt-2 text-teal-600">
//               *Landlords see Tenants and their Occupants. Tenants see their Occupants.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );


//   const renderView = () => {
//     if (loading) return <div className="p-6 text-center text-gray-500">Loading Mock Data...</div>;
//     if (!userId || !userProfile) return <div className="p-6 text-center text-red-500">Mock User Profile Not Found.</div>;

//     switch (currentView) {
//       case 'dashboard':
//         return <DashboardView />;
//       case 'usermanagement':
//         // Only SuperAdmin and Admin can see full user management
//         if (userProfile.role !== 'SuperAdmin' && userProfile.role !== 'Admin') return <AccessDenied />;
//         return <UserManagementView />;
//       case 'transactions':
//         return <TransactionsView />;
//       case 'myprofile':
//         return <MyProfileView />;
//       default:
//         return <DashboardView />;
//     }
//   };

//   const AccessDenied = () => (
//     <div className="p-10 text-center bg-red-50 text-red-700 rounded-xl shadow-lg m-6">
//       <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
//       <p>Your current role ({userProfile?.role}) does not have permission to view this section.</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row font-sans antialiased">
//       {/* Sidebar for large screens, hidden on small screens */}
//       <div className="hidden lg:block">
//         <Sidebar />
//       </div>

//       {/* Main Content Area */}
//       <main className="flex-grow p-4 lg:p-8">
//         {/* Mobile Header and Sidebar Toggle */}
//         <div className="lg:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow">
//           <h1 className="text-xl font-bold text-teal-600">Portal (Mock)</h1>
//           <button
//             onClick={() => { /* Implement Mobile Menu Toggle if desired */ }}
//             className="p-2 text-gray-800 bg-gray-200 rounded-lg"
//           >
//             <Home className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-2xl p-0 h-full">
//           {renderView()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default App;


















// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Home, Users, DollarSign, FileText, UserCheck, Shield } from 'lucide-react';

// // --- MOCK DATA DEFINITIONS ---

// // Define a static list of mock users with their roles and relationships
// const MOCK_USERS_DATA = [
//   // Super Admins
//   { id: 'sa-001', name: 'Alex SuperAdmin', role: 'SuperAdmin', email: 'sa@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   // Admins
//   { id: 'ad-001', name: 'Ben Finance Admin', role: 'Admin', email: 'ad@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   // Landlords
//   { id: 'll-001', name: 'Chris Landlord', role: 'Landlord', email: 'll@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   { id: 'll-002', name: 'Dana Landlord', role: 'Landlord', email: 'll2@app.com', landlordId: null, tenantId: null, estateId: 'E001' },
//   // Tenants (under ll-001)
//   { id: 't-001', name: 'Ethan Tenant', role: 'Tenant', email: 't1@app.com', landlordId: 'll-001', tenantId: null, estateId: 'E001' },
//   { id: 't-002', name: 'Fiona Tenant', role: 'Tenant', email: 't2@app.com', landlordId: 'll-001', tenantId: null, estateId: 'E001' },
//   // Occupants (under t-001, belonging to ll-001)
//   { id: 'o-001', name: 'Gary Occupant', role: 'Occupant', email: 'o1@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
//   { id: 'o-002', name: 'Hannah Occupant', role: 'Occupant', email: 'o2@app.com', landlordId: 'll-001', tenantId: 't-001', estateId: 'E001' },
// ];

// // Define mock transactions
// const MOCK_TRANSACTIONS_DATA = [
//   { id: 'tx1', payerId: 't-001', payerRole: 'Tenant', amount: 100, status: 'Paid', timestamp: new Date(Date.now() - 86400000) },
//   { id: 'tx2', payerId: 'o-001', payerRole: 'Occupant', amount: 50, status: 'Paid', timestamp: new Date(Date.now() - 172800000) },
//   { id: 'tx3', payerId: 't-002', payerRole: 'Tenant', amount: 100, status: 'Unpaid', timestamp: new Date(Date.now() - 345600000) },
//   { id: 'tx4', payerId: 'o-002', payerRole: 'Occupant', amount: 50, status: 'Paid', timestamp: new Date(Date.now() - 500000000) },
//   { id: 'tx5', payerId: 'sa-001', payerRole: 'SuperAdmin', amount: 0, status: 'Exempt', timestamp: new Date(Date.now() - 1000000000) },
// ];

// // --- MAIN APPLICATION COMPONENT ---
// const App = () => {
//   // We mock the user ID (starting with a SuperAdmin)
//   const [userId, setUserId] = useState(MOCK_USERS_DATA[0].id);
//   const [userProfile, setUserProfile] = useState(MOCK_USERS_DATA[0]);
//   const [loading, setLoading] = useState(false); // No backend, so loading is fast
//   const [currentView, setCurrentView] = useState('dashboard');
  
//   // State for all users and transactions (mocked "database")
//   const [allMockUsers, setAllMockUsers] = useState(MOCK_USERS_DATA);
//   const [allMockTransactions, setAllMockTransactions] = useState(MOCK_TRANSACTIONS_DATA);

//   // Available Roles
//   const ROLES = useMemo(() => ['SuperAdmin', 'Admin', 'Landlord', 'Tenant', 'Occupant'], []);

//   // --- MOCK INITIALIZATION (Replaces Firebase setup) ---
//   useEffect(() => {
//     // In a real app, this is where we'd fetch the initial profile data.
//     // Here, we just ensure the initial user is correctly loaded from the mock data.
//     const user = MOCK_USERS_DATA.find(u => u.id === userId);
//     if (user) {
//       setUserProfile(user);
//     }
//   }, [userId]);

//   // --- MOCK DATA FILTERING (Replaces Firestore Queries/onSnapshot) ---

//   const filteredUsers = useMemo(() => {
//     if (!userProfile) return [];

//     const role = userProfile.role;

//     if (role === 'SuperAdmin' || role === 'Admin') {
//       // Admins see everyone
//       return allMockUsers;
//     } else if (role === 'Landlord') {
//       // Landlord sees themselves, their direct tenants, and occupants under those tenants
//       const tenantIds = allMockUsers
//         .filter(u => u.landlordId === userId && u.role === 'Tenant')
//         .map(u => u.id);

//       return allMockUsers.filter(u =>
//         u.id === userId ||
//         u.landlordId === userId || // Direct tenants and occupants
//         tenantIds.includes(u.tenantId === null ? "" : u.tenantId) // Occupants whose tenant belongs to this landlord
//       );
//     } else if (role === 'Tenant') {
//       // Tenant sees themselves and their direct occupants
//       return allMockUsers.filter(u => u.id === userId || u.tenantId === userId);
//     } else if (role === 'Occupant') {
//       // Occupants only see themselves
//       return allMockUsers.filter(u => u.id === userId);
//     }
//     return [];
//   }, [allMockUsers, userId, userProfile]);

//   const filteredTransactions = useMemo(() => {
//     if (!userProfile) return [];

//     const role = userProfile.role;

//     if (role === 'SuperAdmin' || role === 'Admin') {
//       // Admins see all transactions
//       return allMockTransactions;
//     } else if (role === 'Landlord') {
//       // Landlords see transactions of their subordinate users (filteredUsers)
//       const subordinateIds = filteredUsers.map(u => u.id);
//       return allMockTransactions.filter(tx => subordinateIds.includes(tx.payerId));
//     }
//     // Tenant/Occupant: Only see their own transactions
//     return allMockTransactions.filter(tx => tx.payerId === userId);
//   }, [allMockTransactions, userId, userProfile, filteredUsers]);


//   // --- MOCK ROLE MANAGEMENT AND ACTIONS ---
//   const handleRoleChange = (newRole:any) => {
//     // 1. Find the new user profile for the simulation
//     const newProfile = MOCK_USERS_DATA.find(u => u.role === newRole) || userProfile;

//     // 2. Update the active user ID and profile
//     setUserId(newProfile.id);
//     setUserProfile(newProfile);
//     setCurrentView('dashboard');
//     console.log(`Role switched to ${newRole} (Mock ID: ${newProfile.id})`);
//   };

//   const handlePayFee = (feeAmount:any) => {
//     if (!userProfile) return;

//     const newTxId = `tx-${Date.now()}`;
//     const newTransaction = {
//       id: newTxId,
//       payerId: userId,
//       payerRole: userProfile.role,
//       amount: feeAmount,
//       status: 'Paid',
//       timestamp: new Date(),
//       description: `Monthly Fee Payment (${userProfile.role})`,
//     };

//     // Add the new transaction to the mock data state
//     setAllMockTransactions(prev => [newTransaction, ...prev]);
//     console.log('Mock Payment successful. Transaction recorded locally.');
//   };

//   // --- 4. UI Components ---

//   const Sidebar = () => {
//     const navItems = [
//       { name: 'Dashboard', icon: Home, roles: ROLES },
//       { name: 'User Management', icon: Users, roles: ['SuperAdmin', 'Admin'] },
//       { name: 'My Profile', icon: UserCheck, roles: ROLES },
//       { name: 'Transactions', icon: FileText, roles: ROLES },
//     ];

//     return (
//       <div className="w-full lg:w-64 bg-gray-800 text-white flex flex-col p-4 shadow-xl">
//         <div className="mb-8 p-3 text-2xl font-bold text-teal-400 border-b border-gray-700">
//           Estate Management (Mock)
//         </div>
//         <nav className="flex-grow">
//           {navItems.filter(item => item.roles.includes(userProfile?.role)).map((item) => (
//             <button
//               key={item.name}
//               className={`flex items-center w-full px-4 py-3 my-1 rounded-lg transition duration-200 ${currentView === item.name.toLowerCase().replace(/\s/g, '') ? 'bg-teal-600' : 'hover:bg-gray-700'}`}
//               onClick={() => setCurrentView(item.name.toLowerCase().replace(/\s/g, ''))}
//             >
//               <item.icon className="w-5 h-5 mr-3" />
//               <span className="font-medium">{item.name}</span>
//             </button>
//           ))}
//         </nav>
//         <div className="mt-4 pt-4 border-t border-gray-700">
//           <p className="text-sm mb-2 text-gray-400">Current Role:</p>
//           <p className="font-semibold text-lg text-yellow-400">{userProfile?.role}</p>
//           <p className="text-xs text-gray-500 break-words">ID: {userId}</p>
//         </div>
//         <button
//           // Mock Sign Out - reset to initial SuperAdmin state
//           onClick={() => handleRoleChange('SuperAdmin')}
//           className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//         >
//           Reset to SuperAdmin
//         </button>
//       </div>
//     );
//   };

//   const Card = ({ title, value, icon: Icon, colorClass }:any) => (
//     <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${colorClass}`}>
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
//         <Icon className="w-6 h-6 text-gray-400" />
//       </div>
//       <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
//     </div>
//   );

//   const DashboardView = () => {
//     const role = userProfile?.role;

//     const getMonthlyFee = () => {
//       switch (role) {
//         case 'SuperAdmin': return 0;
//         case 'Admin': return 50;
//         case 'Landlord': return 200;
//         case 'Tenant': return 100;
//         case 'Occupant': return 50;
//         default: return 0;
//       }
//     };

//     const feeAmount = getMonthlyFee();

//     const stats = useMemo(() => {
//       if (role === 'Landlord') {
//         const tenantCount = allMockUsers.filter(u => u.landlordId === userId && u.role === 'Tenant').length;
//         const unpaidCount = filteredTransactions.filter(tx => tx.status === 'Unpaid').length;
//         return [
//           { title: 'My Tenants', value: tenantCount, icon: Users, color: 'border-blue-500' },
//           { title: 'Outstanding Payments', value: unpaidCount, icon: DollarSign, color: 'border-red-500' },
//           { title: 'My Fee', value: `$${feeAmount}`, icon: DollarSign, color: 'border-teal-500' },
//         ];
//       }
//       if (role === 'Tenant' || role === 'Occupant') {
//         const myTransactions = filteredTransactions.filter(tx => tx.payerId === userId);
//         const paidCount = myTransactions.filter(tx => tx.status === 'Paid').length;
//         const totalPaid = myTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
//         return [
//           { title: 'My Total Paid', value: `$${totalPaid}`, icon: DollarSign, color: 'border-green-500' },
//           { title: 'Payments Count', value: paidCount, icon: FileText, color: 'border-blue-500' },
//           { title: 'Monthly Fee', value: `$${feeAmount}`, icon: DollarSign, color: 'border-teal-500' },
//         ];
//       }
//       return [
//         { title: 'Total Users', value: allMockUsers.length, icon: Users, color: 'border-blue-500' },
//         { title: 'Active Admins', value: allMockUsers.filter(u => u.role.includes('Admin')).length, icon: UserCheck, color: 'border-purple-500' },
//         { title: 'New Transactions', value: filteredTransactions.length, icon: FileText, color: 'border-green-500' },
//       ];
//     }, [role, allMockUsers, filteredTransactions, feeAmount, userId]);


//     return (
//       <div className="p-6 bg-gray-50 flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome, {userProfile?.name}!</h1>
//         <p className="text-xl text-teal-600 mb-8">Role: {role}</p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           {stats.map((stat, index) => (
//             <Card key={index} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
//           ))}
//         </div>

//         {/* Action Section */}
//         {feeAmount > 0 && (
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4">Monthly Fee Payment</h2>
//             <p className="mb-4 text-gray-600">Your current monthly fee is <span className="font-bold text-teal-600">${feeAmount}</span> based on your role as a **{role}**.</p>
//             <button
//               onClick={() => handlePayFee(feeAmount)}
//               className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
//             >
//               Pay Monthly Fee (${feeAmount})
//             </button>
//           </div>
//         )}

//         {/* Role Switcher for Demo */}
//         <div className="mt-10 p-6 bg-yellow-100 border border-yellow-300 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center"><Shield className="w-5 h-5 mr-2" /> Role Simulation (Demo)</h2>
//           <p className="mb-4 text-yellow-700">Switch roles here to test different user permissions and views. This simulates logging in as a different user:</p>
//           <div className="flex flex-wrap gap-3">
//             {ROLES.map((r) => (
//               <button
//                 key={r}
//                 onClick={() => handleRoleChange(r)}
//                 className={`px-4 py-2 text-sm font-medium rounded-full transition ${userProfile?.role === r ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-800 hover:bg-yellow-200 border border-yellow-400'}`}
//               >
//                 Switch to {r}
//               </button>
//             ))}
//           </div>
//           <p className="mt-4 text-xs text-yellow-700">Note: Changing the role also changes your mock User ID to one associated with that role (e.g., Landlord role switches to user 'll-001').</p>
//         </div>
//       </div>
//     );
//   };

//   const UserManagementView = () => {
//     const role = userProfile?.role;

//     return (
//       <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">User Management</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           {role === 'SuperAdmin' ? 'View and manage all users and admins.' :
//             role === 'Admin' ? 'Manage tenants, landlords, and occupants.' :
//               'Role not authorized for full management view.'}
//         </p>

//         <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
//           <div className="flex font-bold text-gray-700 border-b pb-2 mb-2">
//             <div className="w-1/6">Role</div>
//             <div className="w-2/6">Name / ID</div>
//             <div className="w-2/6">Email (Mock)</div>
//             <div className="w-1/6">Relationship</div>
//           </div>
//           <div className="max-h-96 overflow-y-auto">
//             {filteredUsers.map(user => (
//               <div key={user.id} className="flex py-2 border-b border-gray-200 hover:bg-teal-50 transition">
//                 <div className="w-1/6 font-medium text-teal-600">{user.role}</div>
//                 <div className="w-2/6">
//                   <span className="font-semibold">{user.name}</span>
//                   <span className="text-xs block text-gray-500">ID: {user.id}</span>
//                 </div>
//                 <div className="w-2/6 text-gray-600">{user.email}</div>
//                 <div className="w-1/6 text-xs text-gray-500">
//                   {user.landlordId ? `L: ${user.landlordId}` : user.tenantId ? `T: ${user.tenantId}` : 'N/A'}
//                 </div>
//               </div>
//             ))}
//           </div>
//           {filteredUsers.length === 0 && <p className="text-center py-4 text-gray-500">No users found for this role's scope.</p>}
//         </div>
//       </div>
//     );
//   };

//   const TransactionsView = () => {
//     const role = userProfile?.role;
//     const isLandlord = role === 'Landlord';
//     const isPayer = ['Tenant', 'Occupant'].includes(role);

//     return (
//       <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Transaction Details</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           {isLandlord && 'Viewing payment history for your tenants and occupants.'}
//           {isPayer && 'Viewing your personal payment history.'}
//           {['SuperAdmin', 'Admin'].includes(role) && 'Viewing all system transactions.'}
//         </p>

//         <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
//           <div className="hidden sm:flex font-bold text-gray-700 border-b pb-2 mb-2">
//             <div className="w-1/5">Date</div>
//             <div className="w-1/5">Payer ID</div>
//             <div className="w-1/5">Role</div>
//             <div className="w-1/5">Amount</div>
//             <div className="w-1/5">Status</div>
//           </div>
//           <div className="max-h-[70vh] overflow-y-auto">
//             {filteredTransactions.map(tx => (
//               <div key={tx.id} className="flex flex-wrap sm:flex-nowrap py-3 border-b border-gray-200 hover:bg-blue-50 transition">
//                 <div className="w-full sm:w-1/5 text-sm font-medium text-gray-700">
//                   {tx.timestamp?.toLocaleDateString()}
//                 </div>
//                 <div className="w-full sm:w-1/5 text-xs text-gray-500 sm:text-base">{tx.payerId}</div>
//                 <div className="w-full sm:w-1/5 text-xs text-gray-500 sm:text-base">{tx.payerRole}</div>
//                 <div className="w-1/2 sm:w-1/5 font-bold text-green-600">${tx.amount}</div>
//                 <div className="w-1/2 sm:w-1/5">
//                   <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tx.status === 'Paid' ? 'bg-green-100 text-green-800' : tx.status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
//                     {tx.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {filteredTransactions.length === 0 && <p className="text-center py-4 text-gray-500">No transactions found.</p>}
//         </div>
//       </div>
//     );
//   };


//   const MyProfileView = () => {
//     // Users subordinate to the current user (Tenants/Occupants for Landlord; Occupants for Tenant)
//     const subordinates = filteredUsers.filter(u => u.id !== userId);

//     return (
//       <div className="p-6 bg-white flex-grow rounded-lg min-h-screen">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">My Profile & Hierarchy</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* 1. Main Profile Details (Left Column) */}
//           <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl border-t-4 border-teal-500 h-fit">
//             <div className="flex items-center space-x-4 mb-6">
//               <UserCheck className="w-10 h-10 text-teal-600 bg-teal-100 p-2 rounded-full" />
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">{userProfile?.name || 'User Name'}</p>
//                 <p className="text-sm font-semibold text-yellow-600">{userProfile?.role}</p>
//               </div>
//             </div>

//             <div className="space-y-4 text-gray-700">
//               <div className="border-b pb-3">
//                 <p className="text-xs uppercase text-gray-500 mb-1">Unique Identifier</p>
//                 <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{userId}</p>
//               </div>
//               <div className="border-b pb-3">
//                 <p className="text-xs uppercase text-gray-500 mb-1">Primary Email (Mock)</p>
//                 <p className="font-semibold">{userProfile?.email || 'N/A'}</p>
//               </div>
//               <div className="border-b pb-3">
//                 <p className="text-xs uppercase text-gray-500 mb-1">Estate</p>
//                 <p className="font-semibold">{userProfile?.estateId || 'N/A'}</p>
//               </div>
              
//               {/* Relationship Details */}
//               {(userProfile?.landlordId || userProfile?.tenantId) && (
//                 <div className="pt-2">
//                   <p className="text-xs uppercase text-gray-500 mb-2">My Direct Relationships</p>
//                   {userProfile?.landlordId && (
//                     <div className="flex items-center space-x-2 text-sm">
//                       <Shield className="w-4 h-4 text-purple-500" />
//                       <p><strong>Landlord:</strong> <span className="font-mono text-gray-600">{userProfile.landlordId}</span></p>
//                     </div>
//                   )}
//                   {userProfile?.tenantId && (
//                     <div className="flex items-center space-x-2 text-sm">
//                       <Users className="w-4 h-4 text-blue-500" />
//                       <p><strong>Tenant:</strong> <span className="font-mono text-gray-600">{userProfile.tenantId}</span> (My Manager)</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* 2. Subordinate Users List (Right Column) */}
//           {(userProfile?.role === 'Landlord' || userProfile?.role === 'Tenant') ? (
//             <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200">
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//                 <Users className="w-6 h-6 mr-3 text-teal-600" />
//                 Subordinate Users ({subordinates.length})
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 {userProfile.role === 'Landlord'
//                   ? 'This list includes all your direct Tenants and the Occupants managed by those Tenants.'
//                   : 'This list includes all Occupants registered under your tenancy.'}
//               </p>
              
//               {subordinates.length > 0 ? (
//                 <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
//                   {subordinates.map(sub => (
//                     <div 
//                       key={sub.id} 
//                       className={`p-4 rounded-lg shadow-md transition transform hover:scale-[1.01] ${sub.role === 'Tenant' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}
//                     >
//                       <div className="flex justify-between items-center mb-1">
//                         <p className="font-semibold text-lg">{sub.name}</p>
//                         <span className={`px-3 py-1 text-xs font-bold rounded-full ${sub.role === 'Tenant' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
//                           {sub.role}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-500">Email: {sub.email}</p>
//                       <p className="text-xs text-gray-400">ID: {sub.id}</p>
//                       {sub.tenantId && <p className="text-xs text-gray-500 mt-1">Managed by Tenant: {sub.tenantId}</p>}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
//                   <p className="text-xl">No Subordinate Users Found</p>
//                   <p className="text-sm mt-2">Check the Role Simulation on the Dashboard to ensure you are a Landlord or Tenant with assigned subordinates.</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="lg:col-span-2 p-6 bg-white border border-dashed border-gray-300 rounded-xl text-center flex items-center justify-center">
//                 <p className="text-xl text-gray-500">
//                     <Shield className="inline-block w-5 h-5 mr-2" />
//                     As an **{userProfile?.role}**, you do not manage other users in the hierarchy.
//                 </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ... rest of the App component (no other changes needed)
//   const renderView = () => {
//     if (loading) return <div className="p-6 text-center text-gray-500">Loading Mock Data...</div>;
//     if (!userId || !userProfile) return <div className="p-6 text-center text-red-500">Mock User Profile Not Found.</div>;

//     switch (currentView) {
//       case 'dashboard':
//         return <DashboardView />;
//       case 'usermanagement':
//         // Only SuperAdmin and Admin can see full user management
//         if (userProfile.role !== 'SuperAdmin' && userProfile.role !== 'Admin') return <AccessDenied />;
//         return <UserManagementView />;
//       case 'transactions':
//         return <TransactionsView />;
//       case 'myprofile':
//         return <MyProfileView />;
//       default:
//         return <DashboardView />;
//     }
//   };

//   const AccessDenied = () => (
//     <div className="p-10 text-center bg-red-50 text-red-700 rounded-xl shadow-lg m-6">
//       <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
//       <p>Your current role ({userProfile?.role}) does not have permission to view this section.</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row font-sans antialiased">
//       {/* Sidebar for large screens, hidden on small screens */}
//       <div className="hidden lg:block">
//         <Sidebar />
//       </div>

//       {/* Main Content Area */}
//       <main className="flex-grow p-4 lg:p-8">
//         {/* Mobile Header and Sidebar Toggle */}
//         <div className="lg:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow">
//           <h1 className="text-xl font-bold text-teal-600">Portal (Mock)</h1>
//           <button
//             onClick={() => { /* Implement Mobile Menu Toggle if desired */ }}
//             className="p-2 text-gray-800 bg-gray-200 rounded-lg"
//           >
//             <Home className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="bg-white rounded-xl shadow-2xl p-0 h-full">
//           {renderView()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default App;