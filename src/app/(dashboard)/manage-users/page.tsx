"use client"
import React, { useState, useCallback, useMemo } from 'react';
import { Users, Loader2, X, Filter, Search, Edit, Eye, Download, FileSpreadsheet } from 'lucide-react';
import { useDownload, useFetch } from '@/hooks/useFetch';
import { PaginationControls } from '../inventory/pagination';
import { Modal } from '../inventory/modal';
import { SearchFilters, UserDto } from '@/types/reponse';
import { baseUrL } from '@/env/URLs';
import UserEditForm from './userEdit';
import { UserStatistics } from './userStatistics';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

const UserManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingUser, setEditingUser] = useState<UserDto | undefined>(undefined);
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const [searchQuery, setSearchQuery] = useState<SearchFilters>(initialFilters);
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();

    const { downloadExcel } = useDownload();

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

    const fetchUrl = `${baseUrL}/get-users-by-estate?${queryParams}`;
    const exportUsersUrl = `${baseUrL}/export-users`;

    const {
        data: usersResponse,
        isLoading: usersLoading,
        error: usersError,
        callApi: refetchUsers
    } = useFetch("GET", null, fetchUrl);

    const paginatedUsers = usersResponse?.data?.data || [];
    const userCount = usersResponse?.data?.total || 0;
    const totalPages = Math.ceil(userCount / ITEMS_PER_PAGE) || 1;

    const handleDownload = useCallback(async (useCurrentFilters: boolean = true) => {
        setIsDownloading(true);
        try {
            const url = new URL(exportUsersUrl, window.location.origin);
            
            if (useCurrentFilters) {
                const paramsToUse = searchQuery;
                if (paramsToUse.firstName) url.searchParams.append('firstName', paramsToUse.firstName);
                if (paramsToUse.lastName) url.searchParams.append('lastName', paramsToUse.lastName);
                if (paramsToUse.email) url.searchParams.append('email', paramsToUse.email);
                if (paramsToUse.roleId) url.searchParams.append('roleId', paramsToUse.roleId);
                if (paramsToUse.isActive) url.searchParams.append('isActive', paramsToUse.isActive);
                if (paramsToUse.roleName) url.searchParams.append('roleName', paramsToUse.roleName);
                if (paramsToUse.designation) url.searchParams.append('designation', paramsToUse.designation);
            }

            url.searchParams.append('sortDirection', 'ASC');
            url.searchParams.append('sortProperty', 'firstName');

            const dateStr = new Date().toISOString().split('T')[0];
            const filterStr = useCurrentFilters && Object.values(searchQuery).some(v => v) 
                ? '_filtered' 
                : '_all';
            const filename = `users_export${filterStr}_${dateStr}.xlsx`;

            const result = await downloadExcel(url.toString(), filename);
            
            if (result.success) {
                console.log('Download successful:', result.filename);
            } else {
                console.error('Download failed:', result.error);
            }
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setIsDownloading(false);
        }
    }, [searchQuery, downloadExcel, exportUsersUrl]);

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
        } else if (filterType === 'designation') {
            setFilters(prev => ({ ...prev, designation: filterValue }));
            setSearchQuery(prev => ({ ...prev, designation: filterValue }));
        }
    }, []);

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

    const activeFilterCount = Object.values(searchQuery).filter(v => v && v !== '').length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
                <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">User Management</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => handleDownload(true)}
                        disabled={isDownloading}
                        className="relative group flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                <span>Downloading...</span>
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Export Excel</span>
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                    <div 
                        onClick={goToRoleManagementPage} 
                        className='flex-1 sm:flex-none bg-blue-500 text-[white] p-2 rounded-[8px] cursor-pointer text-center text-[10px] sm:text-[14px] whitespace-nowrap'
                    >
                        Manage Roles
                    </div>
                </div>
            </div>

            <UserStatistics onStatClick={handleStatClick} />

            <SearchFilterComponent
                filters={filters}
                handleFilterChange={handleFilterChange}
                applySearch={applySearch}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                activeFilterCount={activeFilterCount}
            />

            {usersLoading && (
                <div className="text-center py-10 text-blue-600">
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
                                            className="block py-2 sm:py-0 sm:table-row hover:bg-blue-50 transition duration-150 border-b cursor-pointer"
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
                                                    <span className="font-medium text-blue-600 sm:text-[14px] text-[10px] ml-[2px]">{user.designation}</span>
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
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition"
                                                        aria-label={`View ${user.firstName} details`}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => openEditModal(user, e)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition"
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
    designation: ''
};

const SearchFilterComponent: React.FC<{
    filters: SearchFilters;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    applySearch: (e: React.FormEvent) => void;
    onDownload: (useCurrentFilters: boolean) => void;
    isDownloading: boolean;
    activeFilterCount: number;
}> = React.memo(({ filters, handleFilterChange, applySearch, onDownload, isDownloading, activeFilterCount }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDownload(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                        <Filter className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-gray-800 truncate">Search Users</h2>
                        <p className="text-xs text-gray-500 truncate">Filter and find specific users</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                        onClick={handleDownloadClick}
                        disabled={isDownloading}
                        className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download with current filters"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <>
                                <Download className="w-3.5 h-3.5" />
                                <span className="xs:inline">Export</span>
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isExpanded ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
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
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Status</label>
                                <select
                                    name="isActive"
                                    value={filters.isActive}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
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
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Destination</label>
                                <select
                                    name="designation"
                                    value={filters.designation}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                                >
                                    <option value="">Designation</option>
                                    <option value="LANDLORD">Landlord</option>
                                    <option value="TENANT">Tenant</option>
                                    <option value="OCCUPANT">Occupant</option>
                                    <option value="EXTERNAL">External</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-3">
                            <div className="flex flex-col xl:flex-row items-stretch xs:items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="px-4 py-2 text-sm text-red-600 border border-[red] hover:text-gray-800 transition-colors rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownloadClick}
                                    disabled={isDownloading}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            <span>Download Filtered</span>
                                            {activeFilterCount > 0 && (
                                                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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

SearchFilterComponent.displayName = 'SearchFilterComponent';