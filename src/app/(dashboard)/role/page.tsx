
"use client"
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Users, Loader2, CheckCircle, AlertTriangle, X, Edit, ChevronLeft, ChevronRight, Key, PlusCircle, CheckSquare, Square } from 'lucide-react';
import { usePost } from '@/hooks/usePost';
import { useFetch } from '@/hooks/useFetch';

const baseUrL = "http://localhost:8091/api/v1";

// --- UPDATED TYPESCRIPT INTERFACES (UNCHANGED) ---

interface PermissionDto {
    id: number;
    name: string;
    description: string;
    category?: string;
    dateCreated: string | null;
}

interface RoleDto {
    id: number;
    name: string;
    description: string;
    dateCreated?: string;
    lastUpdated?: string;
    permissionNames: string[];
}

interface RoleDtoRequest {
    name: string;
    description: string;
    permissionIds: number[]; 
}

interface RoleUpdateRequest {
    permissionNames: string[];
}

interface PermissionByCategoryDto {
    category: string;
    permissions: PermissionDto[];
}

interface BaseResponse {
    message: string;
    statusCode: number;
    error: string | null;
    success: boolean;
    timestamp: string;
    data: any;
}

interface PaginatedResponse<T> { 
    page: number; 
    size: number; 
    total: number; 
    data: T; 
}

interface Response { message: string; }

// Nested response structure for roles/permissions list fetch
type RolesFetchResponse = PaginatedResponse<RoleDto[]>;
type PermissionsFetchResponse = PaginatedResponse<PermissionByCategoryDto[]>;

const ITEMS_PER_PAGE = 10; 

// --- UPDATED CREATE ROLE FORM (COMPACTED) ---

interface CreateRoleFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ onSuccess, onClose }) => {
    const [role, setRole] = useState<{ name: string, description: string }>({ name: '', description: '' });
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
    const [allPermissions, setAllPermissions] = useState<PermissionDto[]>([]);
    const [response, setResponse] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Fetch all permissions
    const { 
        data: permissionsResponse, 
        isLoading: permissionsLoading 
    } = useFetch("GET", null, `${baseUrL}/permissions?page=0&size=1000`); 

    useEffect(() => {
        if (permissionsResponse?.statusCode === 200 && Array.isArray(permissionsResponse.data?.data)) {
            setAllPermissions(permissionsResponse.data.data);
        }
    }, [permissionsResponse]);

    // Prepare request body with permission IDs
    const createRoleBody = useMemo(() => ({
        ...role,
        ids: Array.from(selectedPermissionIds)
    }), [role, selectedPermissionIds]);
    
    const { 
        callApi: createRoleApi, 
        isLoading: createLoading 
    } = usePost("POST", createRoleBody, `${baseUrL}/create-role`, null); 

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRole(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { 
            setErrors(prev => ({ ...prev, [name]: '' })); 
        }
    }, [errors]);

    const handleTogglePermission = useCallback((permissionId: number) => {
        setSelectedPermissionIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(permissionId)) {
                newSet.delete(permissionId);
            } else {
                newSet.add(permissionId);
            }
            return newSet;
        });
    }, []);

    const validateForm = (data: typeof role) => {
        const newErrors: { [key: string]: string } = {};
        if (!data.name.trim()) newErrors.name = "Role name is required.";
        if (!data.description.trim()) newErrors.description = "Description is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse({ type: null, message: '' });

        const validationErrors = validateForm(role);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            const apiResponse: any = await createRoleApi(); 

            if (apiResponse?.success) {
                setResponse({ type: 'success', message: apiResponse.message || "Role created successfully." });
                setTimeout(() => {
                    onSuccess(); 
                }, 1000); 
            } else {
                setResponse({ type: 'error', message: apiResponse?.error || `Failed to create role.` });
            }
        } catch (error) {
            setResponse({ type: 'error', message: 'An unexpected network error occurred.' });
        }
    };

    const FeedbackMessage: React.FC<{ type: 'success' | 'error'; message: string }> = ({ type, message }) => (
        <div className={`p-3 rounded-lg flex items-center space-x-2 ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-sm mb-3`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="font-medium text-sm">{message}</p>
        </div>
    );

    // Group permissions by category for better organization
    const permissionsByCategory = useMemo(() => {
        const grouped: { [key: string]: PermissionDto[] } = {};
        
        allPermissions.forEach(permission => {
            const category = permission.category || 'Other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(permission);
        });
        
        return grouped;
    }, [allPermissions]);

    return (
        // Reduced space-y-4 to space-y-3
        <form onSubmit={handleSubmit} className="space-y-3">
            {response.type && <FeedbackMessage type={response.type} message={response.message} />}

            <div className="flex flex-col space-y-1">
                <label className="text-[12px] font-medium text-gray-700">Role Name (e.g., FINANCE_ADMIN)</label>
                <input
                    name="name"
                    value={role.name}
                    onChange={handleChange}
                    className={`px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={createLoading}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col space-y-1">
                <label className="text-[12px] font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    rows={2} // Kept at 2 rows
                    value={role.description}
                    onChange={handleChange}
                    className={`px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={createLoading}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Permissions Selection Section - Reduced Height and Padding */}
            <div className="flex flex-col space-y-2"> {/* Reduced space-y-3 to space-y-2 */}
                <label className="text-[12px] font-medium text-gray-700">Select Permissions</label>
                
                {permissionsLoading ? (
                    <div className="text-center py-4 text-teal-600">
                        <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
                        <p className="text-xs">Loading permissions...</p>
                    </div>
                ) : (
                    // Reduced h-48 to h-40
                    <div className="h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-3 bg-gray-50"> 
                        {Object.keys(permissionsByCategory).length > 0 ? (
                            Object.entries(permissionsByCategory).map(([category, permissions]) => (
                                <div key={category} className="border-b pb-2 last:border-b-0">
                                    <h3 className="font-bold text-gray-800 text-xs bg-white px-2 py-1 rounded sticky top-0 z-10">
                                        {category.replace('_', ' ') || 'Uncategorized'}
                                    </h3>
                                    <div className="space-y-1 pt-1">
                                        {permissions.map(permission => {
                                            const isSelected = selectedPermissionIds.has(permission.id);
                                            return (
                                                <div 
                                                    key={permission.id} 
                                                    // Reduced p-2 to p-1.5
                                                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition ${
                                                        isSelected ? 'bg-teal-50 hover:bg-teal-100' : 'hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => handleTogglePermission(permission.id)}
                                                >
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-sm font-medium">{permission.name}</span>
                                                        <span className="text-xs text-gray-500">{permission.description}</span>
                                                    </div>
                                                    {isSelected 
                                                        ? <CheckSquare className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                                        : <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-4">
                                No permissions available to display.
                            </p>
                        )}
                    </div>
                )}
                
                {selectedPermissionIds.size > 0 && (
                    <p className="text-xs text-teal-600 font-medium">
                        {selectedPermissionIds.size} permission(s) selected
                    </p>
                )}
            </div>

            <button
                type="submit"
                // Reduced py-3 to py-2.5
                className="w-full flex items-center justify-center px-4 py-2.5 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition disabled:bg-teal-400"
                disabled={createLoading || permissionsLoading}
            >
                {createLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <PlusCircle className="w-5 h-5 mr-2" />}
                Create Role
            </button>
        </form>
    );
};

// B. Edit Permissions Form (COMPACTED)
interface EditPermissionsFormProps {
    onSuccess: () => void;
    initialRole: RoleDto;
}

const EditPermissionsForm: React.FC<EditPermissionsFormProps> = ({ onSuccess, initialRole }) => {
    const [allPermissions, setAllPermissions] = useState<PermissionByCategoryDto[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set(initialRole.permissionNames));
    const [response, setResponse] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    
    // 1. Fetch all permissions by category
    const { 
        data: permissionsResponse, 
        isLoading: permissionsLoading 
    } = useFetch("GET", null, `${baseUrL}/get-permission-by-category`); 

    useEffect(() => {
        if (permissionsResponse?.statusCode === 200 && Array.isArray(permissionsResponse.data?.data)) {
            setAllPermissions(permissionsResponse.data.data);
        }
    }, [permissionsResponse]);


    // 2. Prepare update API call
    const updateBody = useMemo(() => ({ permissionNames: Array.from(selectedPermissions) }), [selectedPermissions]).permissionNames;
    const updateBodyRequest = { permissionNames: updateBody};
    const { 
        callApi: updatePermissionsApi, 
        isLoading: updateLoading 
    } = usePost("PUT",updateBodyRequest, `${baseUrL}/update-role-add-permission?role-name=${initialRole.name}`, null);

    const handleTogglePermission = useCallback((permissionName: string) => {
        setSelectedPermissions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(permissionName)) {
                newSet.delete(permissionName);
            } else {
                newSet.add(permissionName);
            }
            return newSet;
        });
    }, []);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse({ type: null, message: '' });

        try {
            const apiResponse: any = await updatePermissionsApi(); 

            if (apiResponse?.success) {
                setResponse({ type: 'success', message: apiResponse.message || "Permissions updated successfully." });
                
                setTimeout(() => {
                    onSuccess(); 
                }, 1000); 
            } else {
                setResponse({ type: 'error', message: apiResponse?.message || `Failed to update permissions.` });
            }
        } catch (error) {
            setResponse({ type: 'error', message: 'An unexpected network error occurred.' });
        }
    };
    
    const FeedbackMessage: React.FC<{ type: 'success' | 'error'; message: string }> = ({ type, message }) => (
        // Reduced p-4 to p-3, mb-4 to mb-3
        <div className={`p-3 rounded-lg flex items-center space-x-2 ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-sm mb-3`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="font-medium text-sm">{message}</p>
        </div>
    );


    if (permissionsLoading) {
        return (
            <div className="text-center py-10 text-teal-600">
                <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
                <p className="font-semibold">Fetching permissions...</p>
            </div>
        );
    }
    
    return (
        // Reduced space-y-6 to space-y-4
        <form onSubmit={handleSubmit} className="space-y-4">
            {response.type && <FeedbackMessage type={response.type} message={response.message} />}

            <p className="text-sm text-gray-600">Editing permissions for **{initialRole.name}**.</p>

            {/* Reduced h-64 to h-56 and reduced padding */}
            <div className="h-56 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-3">
                {allPermissions.length > 0 ? allPermissions.map(categoryData => (
                    <div key={categoryData.category} className="border-b pb-2 last:border-b-0">
                        <h3 className="font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded sticky top-0 z-10 text-sm">{categoryData.category?.replace('_', ' ') || 'Uncategorized'}</h3>
                        <div className="space-y-1 pt-1">
                            {categoryData.permissions.map(permission => {
                                const isSelected = selectedPermissions.has(permission.name);
                                return (
                                    <div 
                                        key={permission.name} 
                                        // Reduced p-2 to p-1.5
                                        className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition ${isSelected ? 'bg-teal-50 hover:bg-teal-100' : 'hover:bg-gray-50'}`}
                                        onClick={() => handleTogglePermission(permission.name)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{permission.name}</span>
                                            <span className="text-xs text-gray-500">{permission.description}</span>
                                        </div>
                                        {isSelected 
                                            ? <CheckSquare className="w-4 h-4 text-teal-600" /> 
                                            : <Square className="w-4 h-4 text-gray-400" /> // Reduced icon size to w-4 h-4
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">No permissions found or available to display.</p>
                )}
            </div>

            <button
                type="submit"
                // Reduced py-3 to py-2.5
                className="w-full flex items-center justify-center px-4 py-2.5 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition disabled:bg-teal-400"
                disabled={updateLoading}
            >
                {updateLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Edit className="w-5 h-5 mr-2" />}
                Update Permissions
            </button>
        </form>
    );
};


// --- 2. Main Role Management Page Component (MODAL CHANGES) ---

const RoleManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingRole, setEditingRole] = useState<RoleDto | undefined>(undefined); 

    // --- Data Fetching ---

    const fetchUrl = `${baseUrL}/roles?page=${currentPage - 1}&size=${ITEMS_PER_PAGE}`;
    
    const {
        data: rolesResponse,
        isLoading: rolesLoading,
        error: rolesError,
        callApi: refetchRoles
    } = useFetch("GET", null, fetchUrl); 

    const paginatedRoles = rolesResponse?.data?.data || [];
    const roleCount = rolesResponse?.data?.total || 0;
    const totalPages = Math.ceil(roleCount / ITEMS_PER_PAGE) || 1;


    // --- Callbacks ---
    const handleRoleUpdateSuccess = () => {
        refetchRoles();
        setEditingRole(undefined);
        setIsModalOpen(false); 
        setIsEditModalOpen(false);
    };

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const openEditModal = (role: RoleDto) => {
        setEditingRole(role);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setEditingRole(undefined); 
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // --- Modal Component ---
    const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string, isOpen: boolean, maxWidth?: string }> = ({ children, onClose, title, isOpen, maxWidth = 'max-w-lg' }) => {
        const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };

        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }, [onClose]);

        if (!isOpen) return null;

        return (
            <div 
                className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
                onClick={handleOverlayClick}
            >
                <div className={`bg-white rounded-xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative`}>
                    <div className="p-5 sm:p-6 pb-2 border-b"> {/* Reduced padding */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2> {/* Reduced font size for title */}
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" /> {/* Reduced icon size */}
                    </button>
                    <div className="p-5 sm:p-6 pt-3"> {/* Reduced padding and top padding */}
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // --- Pagination Controls Component (UNCHANGED) ---
    const PaginationControls: React.FC = () => {
        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, roleCount);
        
        if (rolesLoading || roleCount === 0) return null;
        if (roleCount <= ITEMS_PER_PAGE && totalPages <= 1) return null; 

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white rounded-xl shadow-md border-t border-gray-100">
                {/* Info */}
                <p className="text-sm text-gray-700 mb-3 sm:mb-0">
                    Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{roleCount}</span> roles
                </p>

                {/* Controls */}
                <div className="flex space-x-1">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-1 mx-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => goToPage(index + 1)}
                                className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === index + 1
                                    ? 'bg-teal-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                aria-label={`Go to page ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

            {/* Page Header and Action */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center space-x-3">
                    <Key className="w-8 h-8 text-teal-600" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Role Management</h1>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-teal-600 text-white font-bold text-sm rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
                >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Create Role</span>
                    <span className="sm:hidden">New</span>
                </button>
            </div>

            {/* Loading/Error State */}
            {rolesLoading && (
                <div className="text-center py-10 text-teal-600">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                    <p className="font-semibold">Loading roles...</p>
                </div>
            )}
            {rolesError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    <p className="font-semibold">Error fetching roles: {rolesError}</p>
                    <button onClick={() => refetchRoles()} className="text-sm underline mt-2">Try Again</button>
                </div>
            )}

            {/* Roles Table (UNCHANGED) */}
            {!rolesLoading && !rolesError && (
                <>
                    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden sm:table-header-group">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Role Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Permissions Count</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedRoles.map((role: RoleDto) => (
                                    <tr
                                        key={role.id}
                                        className="block sm:table-row hover:bg-teal-50 transition duration-150 border-b"
                                    >
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell whitespace-normal text-gray-900">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Role Name:</span>
                                            <span className="font-bold text-teal-700">{role.name}</span>
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-600 max-w-xs truncate">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Description:</span>
                                            {role.description}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap text-sm font-medium">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Permissions:</span>
                                            <span className="font-semibold bg-gray-200 px-2 py-1 rounded-full text-xs">
                                                {role.permissionNames?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell text-right sm:text-right text-sm font-medium">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Actions:</span>
                                            <button
                                                onClick={() => openEditModal(role)}
                                                className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
                                                aria-label={`Edit permissions for ${role.name}`}
                                                title="Edit Permissions"
                                            >
                                                <Key className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedRoles.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
                                            {roleCount === 0 ? "No roles found. Click 'Create Role' to begin." : "No roles found on this page."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <PaginationControls />
                </>
            )}

            {/* Create Role Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Create New Role"
                // Reduced from max-w-2xl to max-w-lg
                maxWidth="max-w-lg" 
            >
                <CreateRoleForm
                    onSuccess={handleRoleUpdateSuccess}
                    onClose={closeModal}
                />
            </Modal>

            {/* Edit Permissions Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                title={`Manage Permissions for ${editingRole?.name}`}
                // Reduced from max-w-xl to max-w-lg
                maxWidth="max-w-lg"
            >
                {editingRole && (
                    <EditPermissionsForm
                        onSuccess={handleRoleUpdateSuccess}
                        initialRole={editingRole}
                    />
                )}
            </Modal>
        </div>
    );
};

export default RoleManagementPage;
// ```

// Would you like to review specific spacing changes or move on to another part of your application?