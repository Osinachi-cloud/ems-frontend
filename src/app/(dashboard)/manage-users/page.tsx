"use client"
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Users, Loader2, CheckCircle, AlertTriangle, X, Search, Edit, ChevronLeft, ChevronRight, Space } from 'lucide-react';
import { usePost } from '@/hooks/usePost';
import { useFetch } from '@/hooks/useFetch';
import { PaginationControls } from '../inventory/pagination';
import { Modal } from '../inventory/modal';
import { InputFieldProps, Response, SearchFilters, UserDto } from '@/types/reponse';
import { initialFilters, SearchFilterComponent } from './search';
import { baseUrL } from '@/env/URLs';
import { UserEditForm } from './userEdit';
import { UserStatistics } from './userStatistics';
import { useRouter } from 'next/navigation';

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

    const openEditModal = (user: UserDto) => {
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
                        <div onClick={goToRoleManagementPage} className='bg-blue-500 text-[white] p-2 rounded-[8px] cursor-pointer'>
                            Manage Roles
                        </div>
                    </div>
                </div>

            </div>

            <UserStatistics />

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
                                    <th className="px-[2px] py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Avartar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Name / ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Contact / Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedUsers.map((user: UserDto) => {
                                    const status = getStatusPill(user.enabled);
                                    return (
                                        <tr
                                            key={user.userId}
                                            className="block py-2 sm:py-0 sm:table-row hover:bg-teal-50 transition duration-150 border-b"
                                        >
                                            <td className="px-[2px] py-4 sm:py-4 sm:px-2 hidden  sm:table-cell whitespace-normal text-gray-900">
                                                <div className='rounded-full w-[45px] h-[45px] text-[#fff] flex justify-center items-center text-[25px] font-bold'
                                                    style={{ backgroundColor: "#" + user.userId.slice(1, 7) }}
                                                >{user.firstName.slice(0, 1).toUpperCase()}{user.lastName.slice(0, 1).toUpperCase()}</div>
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
                                                <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Actions:</span>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
                                                    aria-label={`Edit ${user.firstName}`}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paginatedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
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