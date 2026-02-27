

// "use client"
// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import { Users, Loader2, CheckCircle, AlertTriangle, X, Search, Edit, ChevronLeft, ChevronRight, Space, User, Home, UsersRound } from 'lucide-react';
// import { usePost } from '@/hooks/usePost';
// import { useFetch } from '@/hooks/useFetch';
// import { PaginationControls } from '../inventory/pagination';
// import { Modal } from '../inventory/modal';
// import { InputFieldProps, Response, SearchFilters, UserDto } from '@/types/reponse';
// import { initialFilters, SearchFilterComponent } from './search';
// import { baseUrL } from '@/env/URLs';
// import { UserEditForm } from './userEdit';
// import { UserStatistics } from './userStatistics';
// import { useRouter } from 'next/navigation';

// const ITEMS_PER_PAGE = 10;

// // Add this interface for the hierarchy view
// interface UserHierarchyView {
//     user: UserDto;
//     hierarchyType: 'landlord' | 'tenant' | 'occupant' | null;
//     parentUser?: UserDto;
//     children?: UserDto[];
// }

// const UserManagementPage: React.FC = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [editingUser, setEditingUser] = useState<UserDto | undefined>(undefined);
//     const [filters, setFilters] = useState<SearchFilters>(initialFilters);
//     const [searchQuery, setSearchQuery] = useState<SearchFilters>(initialFilters);
//     const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
//     const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
//     const [hierarchyData, setHierarchyData] = useState<UserHierarchyView | null>(null);
//     const router = useRouter();

//     const queryParams = useMemo(() => {
//         const params = new URLSearchParams();
//         params.append('page', `${currentPage - 1}`);

//         if (searchQuery.firstName) params.append('firstName', searchQuery.firstName);
//         if (searchQuery.lastName) params.append('lastName', searchQuery.lastName);
//         if (searchQuery.email) params.append('email', searchQuery.email);
//         if (searchQuery.roleId) params.append('roleId', searchQuery.roleId);
//         if (searchQuery.isActive) params.append('isActive', searchQuery.isActive);
//         if (searchQuery.roleName) params.append('roleName', searchQuery.roleName);
//         if (searchQuery.designation) params.append('designation', searchQuery.designation);


//         return params.toString();
//     }, [currentPage, searchQuery]);

//     const fetchUrl = `${baseUrL}/get-users?${queryParams}`;

//     const {
//         data: usersResponse,
//         isLoading: usersLoading,
//         error: usersError,
//         callApi: refetchUsers
//     } = useFetch("GET", null, fetchUrl);

//     // Fetch user hierarchy when a user is selected
//     const {
//         data: userHierarchyResponse,
//         isLoading: hierarchyLoading,
//         callApi: fetchUserHierarchy
//     } = useFetch("GET", null, selectedUser ? `${baseUrL}/get-user-hierarchy/${selectedUser.userId}` : '');

//     const paginatedUsers = usersResponse?.data?.data || [];
//     const userCount = usersResponse?.data?.total || 0;
//     const totalPages = Math.ceil(userCount / ITEMS_PER_PAGE) || 1;

//     // Effect to update hierarchy data when response comes in
//     useEffect(() => {
//         if (userHierarchyResponse?.data) {
//             setHierarchyData(userHierarchyResponse.data);
//             setIsHierarchyModalOpen(true);
//         }
//     }, [userHierarchyResponse]);

//     const handleUserSuccess = () => {
//         refetchUsers();
//         setEditingUser(undefined);
//         setIsModalOpen(false);
//     };

//     const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     }, []);

//     const applySearch = useCallback((e: React.FormEvent) => {
//         e.preventDefault();
//         setCurrentPage(1);
//         setSearchQuery(filters);
//     }, [filters]);

//     // Handle statistics card click
//     const handleStatClick = useCallback((filterType: string, filterValue: any) => {
//         setCurrentPage(1);
        
//         if (filterType === 'all') {
//             setFilters(initialFilters);
//             setSearchQuery(initialFilters);
//         } else if (filterType === 'isActive') {
//             setFilters(prev => ({ ...prev, isActive: filterValue }));
//             setSearchQuery(prev => ({ ...prev, isActive: filterValue }));
//         } else if (filterType === 'role') {
//             setFilters(prev => ({ ...prev, roleName: filterValue }));
//             setSearchQuery(prev => ({ ...prev, roleName: filterValue }));
//         } else if (filterType === 'designation') {
//             setFilters(prev => ({ ...prev, designation: filterValue }));
//             setSearchQuery(prev => ({ ...prev, designation: filterValue }));
//         }
        
//     }, []);

//     // Handle user row click to view hierarchy
//     const handleUserClick = useCallback((user: UserDto) => {
//         setSelectedUser(user);
//         fetchUserHierarchy();
//     }, [fetchUserHierarchy]);

//     const openEditModal = (user: UserDto) => {
//         setEditingUser(user);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingUser(undefined);
//     };

//     const closeHierarchyModal = () => {
//         setIsHierarchyModalOpen(false);
//         setSelectedUser(null);
//         setHierarchyData(null);
//     };

//     const getStatusPill = (enabled: boolean) => enabled
//         ? { label: 'Active', classes: 'bg-green-100 text-green-800' }
//         : { label: 'Inactive', classes: 'bg-red-100 text-red-800' };

//     const goToRoleManagementPage = () => {
//         router.push('/role');
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//             <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <div className='w-full'>
//                     <div className="flex items-center justify-between space-x-3 mb-2">
//                         <div className="flex items-center space-x-3">
//                             <Users className="w-8 h-8 text-teal-600" />
//                             <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">User Management</h1>
//                         </div>
//                         <div onClick={goToRoleManagementPage} className='bg-blue-500 text-[white] p-2 rounded-[8px] cursor-pointer text-[10px] whitespace-nowrap mr-[50px] sm:text-[14px]'>
//                             Manage Roles
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Pass the click handler to UserStatistics */}
//             <UserStatistics onStatClick={handleStatClick} />

//             <SearchFilterComponent
//                 filters={filters}
//                 handleFilterChange={handleFilterChange}
//                 applySearch={applySearch}
//             />

//             {searchQuery.roleName && (
//                 <div className="mb-4 flex items-center">
//                     <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center">
//                         <span className="font-medium">Filtered by: {searchQuery.roleName}</span>
//                         <button
//                             onClick={() => {
//                                 setFilters(prev => ({ ...prev, roleName: '' }));
//                                 setSearchQuery(prev => ({ ...prev, roleName: '' }));
//                             }}
//                             className="ml-2 hover:bg-teal-200 rounded-full p-0.5"
//                         >
//                             <X className="w-4 h-4" />
//                         </button>
//                     </span>
//                 </div>
//             )}

//             {usersLoading && (
//                 <div className="text-center py-10 text-teal-600">
//                     <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
//                     <p className="font-semibold">Loading users...</p>
//                 </div>
//             )}
//             {usersError && (
//                 <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
//                     <p className="font-semibold">Error fetching users: {usersError}</p>
//                     <button onClick={() => refetchUsers()} className="text-sm underline mt-2">Try Again</button>
//                 </div>
//             )}

//             {!usersLoading && !usersError && (
//                 <>
//                     <div className="bg-white pl-[8px] rounded-xl shadow-xl overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50 hidden sm:table-header-group">
//                                 <tr>
//                                     <th className="px-[2px] py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Avatar</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Name / ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Contact / Email</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Role</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Designation</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {paginatedUsers.map((user: UserDto) => {
//                                     const status = getStatusPill(user.enabled);
//                                     return (
//                                         <tr
//                                             key={user.userId}
//                                             className="block py-2 sm:py-0 sm:table-row hover:bg-teal-50 transition duration-150 border-b cursor-pointer"
//                                             onClick={() => handleUserClick(user)}
//                                         >
//                                             <td className="px-[2px] py-4 sm:py-4 sm:px-2 hidden sm:table-cell whitespace-normal text-gray-900">
//                                                 <div className='rounded-full w-[45px] h-[45px] text-[#fff] flex justify-center items-center text-[25px] font-bold'
//                                                     style={{ backgroundColor: "#" + user.userId.slice(1, 7) }}
//                                                 >{user.firstName.slice(0, 1).toUpperCase()}{user.lastName.slice(0, 1).toUpperCase()}</div>
//                                             </td>
//                                             <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-normal text-gray-900">
//                                                 <div className='flex gap-4'>
//                                                     <span className="sm:hidden text-xs font-semibold text-gray-500 block">Name:</span>
//                                                     <span className="font-semibold text-[12px] whitespace-nowrap">{user.firstName} {user.lastName}</span>
//                                                 </div>
//                                                 <div className='flex gap-4'>
//                                                     <span className="sm:hidden text-xs font-semibold text-gray-500 block">ID:</span>
//                                                     <span className="text-gray-500 text-[10px] break-all flex"> <span className='hidden sm:block font-bold whitespace-nowrap'>ID: </span>  {" " + user.userId}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-600">
//                                                 <div className='flex gap-4'>
//                                                     <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block">Email:</span>
//                                                     <span className='text-[11px]'>{user.email}</span>
//                                                 </div>
//                                                 <div className='flex gap-4'>
//                                                     <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block">Phone:</span>
//                                                     <span className="text-[11px] text-gray-500 block">{user.phoneNumber}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap text-sm font-medium">
//                                                 <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Role:</span>
//                                                 <span className='sm:text-[14px] text-[10px]'>{user.role?.name || 'N/A'}</span>
//                                             </td>
//                                             <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap text-sm">
//                                                 <div className='flex gap-4'>
//                                                     <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block mr-[2px] w-1/4">Designation:</span>
//                                                     <span className="font-medium text-teal-600 sm:text-[14px] text-[10px] ml-[2px]">{user.designation}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap">
//                                                 <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Status:</span>
//                                                 <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${status.classes}`}>
//                                                     {status.label}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell text-right sm:text-right text-sm font-medium">
//                                                 <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Actions:</span>
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // Prevent row click when clicking edit
//                                                         openEditModal(user);
//                                                     }}
//                                                     className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
//                                                     aria-label={`Edit ${user.firstName}`}
//                                                 >
//                                                     <Edit className="w-4 h-4" />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                                 {paginatedUsers.length === 0 && (
//                                     <tr>
//                                         <td colSpan={7} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
//                                             {userCount === 0 ? "No users found." : "No users matched the current filters."}
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     <PaginationControls
//                         currentPage={currentPage}
//                         setCurrentPage={setCurrentPage}
//                         itemsPerPage={ITEMS_PER_PAGE}
//                         recordCount={userCount}
//                         totalPages={totalPages}
//                         responseLoading={usersLoading}
//                     />
//                 </>
//             )}

//             {/* User Hierarchy Modal */}
//             <Modal
//                 onClose={closeHierarchyModal}
//                 title={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName} - Hierarchy View` : "User Hierarchy"}
//                 isModalOpen={isHierarchyModalOpen}
//             >
//                 {hierarchyLoading ? (
//                     <div className="flex justify-center items-center py-10">
//                         <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
//                         <span className="ml-2">Loading hierarchy...</span>
//                     </div>
//                 ) : hierarchyData && (
//                     <div className="space-y-6">
//                         {/* Current User */}
//                         <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
//                             <div className="flex items-center space-x-3">
//                                 <div className="rounded-full w-12 h-12 text-white flex justify-center items-center text-xl font-bold"
//                                     style={{ backgroundColor: "#" + hierarchyData.user.userId.slice(1, 7) }}
//                                 >
//                                     {hierarchyData.user.firstName.slice(0, 1).toUpperCase()}
//                                     {hierarchyData.user.lastName.slice(0, 1).toUpperCase()}
//                                 </div>
//                                 <div>
//                                     <h3 className="font-bold text-lg">
//                                         {hierarchyData.user.firstName} {hierarchyData.user.lastName}
//                                     </h3>
//                                     <p className="text-sm text-gray-600">
//                                         <span className="font-medium">Role:</span> {hierarchyData.user.role?.name} | 
//                                         <span className="font-medium ml-2">Status:</span> {hierarchyData.user.enabled ? 'Active' : 'Inactive'}
//                                     </p>
//                                     <p className="text-xs text-gray-500">Email: {hierarchyData.user.email}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Parent/Landlord Information */}
//                         {hierarchyData.parentUser && (
//                             <div>
//                                 <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
//                                     <Users className="w-4 h-4 mr-1 text-amber-500" />
//                                     {hierarchyData.hierarchyType === 'tenant' ? 'Landlord' : 'Parent'} 
//                                 </h4>
//                                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 ml-4">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="rounded-full w-10 h-10 text-white flex justify-center items-center text-sm font-bold"
//                                             style={{ backgroundColor: "#" + hierarchyData.parentUser.userId.slice(1, 7) }}
//                                         >
//                                             {hierarchyData.parentUser.firstName.slice(0, 1).toUpperCase()}
//                                             {hierarchyData.parentUser.lastName.slice(0, 1).toUpperCase()}
//                                         </div>
//                                         <div>
//                                             <p className="font-medium">
//                                                 {hierarchyData.parentUser.firstName} {hierarchyData.parentUser.lastName}
//                                             </p>
//                                             <p className="text-xs text-gray-600">
//                                                 Role: {hierarchyData.parentUser.role?.name} • {hierarchyData.parentUser.enabled ? 'Active' : 'Inactive'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Children/Occupants Information */}
//                         {hierarchyData.children && hierarchyData.children.length > 0 && (
//                             <div>
//                                 <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
//                                     <UsersRound className="w-4 h-4 mr-1 text-teal-500" />
//                                     {hierarchyData.user.role?.name === 'Landlord' ? 'Tenants' : 'Occupants'} ({hierarchyData.children.length})
//                                 </h4>
//                                 <div className="space-y-2 ml-4">
//                                     {hierarchyData.children.map((child) => (
//                                         <div key={child.userId} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="rounded-full w-10 h-10 text-white flex justify-center items-center text-sm font-bold"
//                                                     style={{ backgroundColor: "#" + child.userId.slice(1, 7) }}
//                                                 >
//                                                     {child.firstName.slice(0, 1).toUpperCase()}
//                                                     {child.lastName.slice(0, 1).toUpperCase()}
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium">
//                                                         {child.firstName} {child.lastName}
//                                                     </p>
//                                                     <p className="text-xs text-gray-600">
//                                                         Role: {child.role?.name} • {child.enabled ? 'Active' : 'Inactive'}
//                                                     </p>
//                                                     <p className="text-xs text-gray-500">{child.email}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {!hierarchyData.parentUser && (!hierarchyData.children || hierarchyData.children.length === 0) && (
//                             <div className="text-center py-6 text-gray-500">
//                                 <p>No hierarchical relationships found for this user.</p>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </Modal>

//             {/* Edit User Modal */}
//             <Modal
//                 onClose={closeModal}
//                 title={`Edit User: ${editingUser?.firstName} ${editingUser?.lastName}`}
//                 isModalOpen={isModalOpen}
//             >
//                 {editingUser && (
//                     <UserEditForm
//                         onSuccess={handleUserSuccess}
//                         onClose={closeModal}
//                         initialUser={editingUser}
//                     />
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default UserManagementPage;




"use client"
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Users, Loader2, CheckCircle, AlertTriangle, X, Filter, Search, Edit, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { usePost } from '@/hooks/usePost';
import { useFetch } from '@/hooks/useFetch';
import { PaginationControls } from '../inventory/pagination';
import { Modal } from '../inventory/modal';
import { InputFieldProps, Response, SearchFilters, UserDto } from '@/types/reponse';
// import { initialFilters, SearchFilterComponent } from './search';
import { baseUrL } from '@/env/URLs';
import  UserEditForm  from './userEdit';
import { UserStatistics } from './userStatistics';
import { useRouter } from 'next/navigation';
// import { SearchFilters } from "@/types/reponse";

const ITEMS_PER_PAGE = 10;

const UserManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingUser, setEditingUser] = useState<UserDto | undefined>(undefined);
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const [searchQuery, setSearchQuery] = useState<SearchFilters>(initialFilters);
    const router = useRouter();

    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', `${currentPage - 1}`);

        if (searchQuery.firstName) params.append('firstName', searchQuery.firstName);
        if (searchQuery.lastName) params.append('lastName', searchQuery.lastName);
        if (searchQuery.email) params.append('email', searchQuery.email);
        if (searchQuery.roleId) params.append('roleId', searchQuery.roleId);
        if (searchQuery.isActive) params.append('isActive', searchQuery.isActive);
        if (searchQuery.roleName) params.append('roleName', searchQuery.roleName);
        if (searchQuery.designation) params.append('designation', searchQuery.designation);

        return params.toString();
    }, [currentPage, searchQuery]);

    const fetchUrl = `${baseUrL}/get-users?${queryParams}`;

    const {
        data: usersResponse,
        isLoading: usersLoading,
        error: usersError,
        callApi: refetchUsers
    } = useFetch("GET", null, fetchUrl);

    const paginatedUsers = usersResponse?.data?.data || [];
    const userCount = usersResponse?.data?.total || 0;
    const totalPages = Math.ceil(userCount / ITEMS_PER_PAGE) || 1;

    const handleUserSuccess = () => {
        refetchUsers();
        setEditingUser(undefined);
        setIsModalOpen(false);
    };

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const applySearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchQuery(filters);
    }, [filters]);

    // Handle statistics card click
    const handleStatClick = useCallback((filterType: string, filterValue: any) => {
        setCurrentPage(1);
        
        if (filterType === 'all') {
            setFilters(initialFilters);
            setSearchQuery(initialFilters);
        } else if (filterType === 'isActive') {
            setFilters(prev => ({ ...prev, isActive: filterValue }));
            setSearchQuery(prev => ({ ...prev, isActive: filterValue }));
        } else if (filterType === 'role') {
            setFilters(prev => ({ ...prev, roleName: filterValue }));
            setSearchQuery(prev => ({ ...prev, roleName: filterValue }));
        } else if (filterType === 'designation'){
            setFilters(prev => ({ ...prev, designation: filterValue }));
            setSearchQuery(prev => ({ ...prev, designation: filterValue }));
        }
    }, []);

    // Navigate to user details page
    const handleViewDetails = useCallback((userId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/users/${userId}`);
    }, [router]);

    const openEditModal = (user: UserDto, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(undefined);
    };

    const getStatusPill = (enabled: boolean) => enabled
        ? { label: 'Active', classes: 'bg-green-100 text-green-800' }
        : { label: 'Inactive', classes: 'bg-red-100 text-red-800' };

    const goToRoleManagementPage = () => {
        router.push('/role');
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className='w-full'>
                    <div className="flex items-center justify-between space-x-3 mb-2">
                        <div className="flex items-center space-x-3">
                            <Users className="w-8 h-8 text-teal-600" />
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">User Management</h1>
                        </div>
                        <div onClick={goToRoleManagementPage} className='bg-blue-500 text-[white] p-2 rounded-[8px] cursor-pointer text-[10px] whitespace-nowrap mr-[50px] sm:text-[14px]'>
                            Manage Roles
                        </div>
                    </div>
                </div>
            </div>

            <UserStatistics onStatClick={handleStatClick} />

            <SearchFilterComponent
                filters={filters}
                handleFilterChange={handleFilterChange}
                applySearch={applySearch}
            />

            {usersLoading && (
                <div className="text-center py-10 text-teal-600">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                    <p className="font-semibold">Loading users...</p>
                </div>
            )}
            {usersError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    <p className="font-semibold">Error fetching users: {usersError}</p>
                    <button onClick={() => refetchUsers()} className="text-sm underline mt-2">Try Again</button>
                </div>
            )}

            {!usersLoading && !usersError && (
                <>
                    <div className="bg-white pl-[8px] rounded-xl shadow-xl overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden sm:table-header-group">
                                <tr>
                                    <th className="px-[2px] py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Avatar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Name / ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Contact / Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedUsers.map((user: UserDto) => {
                                    const status = getStatusPill(user.enabled);
                                    return (
                                        <tr
                                            key={user.userId}
                                            className="block py-2 sm:py-0 sm:table-row hover:bg-teal-50 transition duration-150 border-b cursor-pointer"
                                            onClick={() => router.push(`/users/${user.userId}`)}
                                        >
                                            <td className="px-[2px] py-4 sm:py-4 sm:px-2 hidden sm:table-cell whitespace-normal text-gray-900">
                                                <div className='rounded-full w-[45px] h-[45px] text-[#fff] flex justify-center items-center text-[25px] font-bold'
                                                    style={{ backgroundColor: "#" + user.userId.slice(1, 7) }}
                                                >{user.firstName?.slice(0, 1).toUpperCase()}{user.lastName?.slice(0, 1).toUpperCase()}</div>
                                            </td>
                                            <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-normal text-gray-900">
                                                <div className='flex gap-4'>
                                                    <span className="sm:hidden text-xs font-semibold text-gray-500 block">Name:</span>
                                                    <span className="font-semibold text-[12px] whitespace-nowrap">{user.firstName} {user.lastName}</span>
                                                </div>
                                                <div className='flex gap-4'>
                                                    <span className="sm:hidden text-xs font-semibold text-gray-500 block">ID:</span>
                                                    <span className="text-gray-500 text-[10px] break-all flex"> <span className='hidden sm:block font-bold whitespace-nowrap'>ID: </span>  {" " + user.userId}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-600">
                                                <div className='flex gap-4'>
                                                    <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block">Email:</span>
                                                    <span className='text-[11px]'>{user.email}</span>
                                                </div>
                                                <div className='flex gap-4'>
                                                    <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block">Phone:</span>
                                                    <span className="text-[11px] text-gray-500 block">{user.phoneNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap text-sm font-medium">
                                                <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Role:</span>
                                                <span className='sm:text-[14px] text-[10px]'>{user.role?.name || 'N/A'}</span>
                                            </td>
                                            <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap text-sm">
                                                <div className='flex gap-4'>
                                                    <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block mr-[2px] w-1/4">Designation:</span>
                                                    <span className="font-medium text-teal-600 sm:text-[14px] text-[10px] ml-[2px]">{user.designation}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap">
                                                <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Status:</span>
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${status.classes}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-0 sm:py-4 sm:px-6 block sm:table-cell text-right sm:text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Actions:</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/users/${user.userId}`);
                                                        }}
                                                        className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
                                                        aria-label={`View ${user.firstName} details`}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => openEditModal(user, e)}
                                                        className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
                                                        aria-label={`Edit ${user.firstName}`}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paginatedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
                                            {userCount === 0 ? "No users found." : "No users matched the current filters."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <PaginationControls
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        recordCount={userCount}
                        totalPages={totalPages}
                        responseLoading={usersLoading}
                    />
                </>
            )}

            <Modal
                onClose={closeModal}
                title={`Edit User: ${editingUser?.firstName} ${editingUser?.lastName}`}
                isModalOpen={isModalOpen}
            >
                {editingUser && (
                    <UserEditForm
                        onSuccess={handleUserSuccess}
                        onClose={closeModal}
                        initialUser={editingUser}
                    />
                )}
            </Modal>
        </div>
    );
};

export default UserManagementPage;





const initialFilters: SearchFilters = {
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    isActive: '',
    designation:''
};

const SearchFilterComponent: React.FC<{
    filters: SearchFilters;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    applySearch: (e: React.FormEvent) => void;
}> = React.memo(({ filters, handleFilterChange, applySearch }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            {/* Compact Header */}
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                        <Filter className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-800">Search Users</h2>
                        <p className="text-xs text-gray-500">Filter and find specific users</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-teal-500' : 'bg-gray-300'}`} />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <X className="w-4 h-4 text-gray-500" />
                        </div>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <form onSubmit={applySearch} className="border-t border-gray-100">
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name..."
                                    value={filters.firstName}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name..."
                                    value={filters.lastName}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    value={filters.email.replace("%40", "")}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Status</label>
                                <select
                                    name="isActive"
                                    value={filters.isActive}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none bg-white"
                                >
                                    <option value="">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Role ID</label>
                                <input
                                    type="text"
                                    name="roleId"
                                    placeholder="Enter role ID..."
                                    value={filters.roleId}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <Search className="w-4 h-4" />
                                <span>Apply Filters</span>
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
});

// export default SearchFilterComponent