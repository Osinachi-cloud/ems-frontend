// // hooks/useRoleManagement.ts
// import { useState, useEffect } from 'react';
// // import { useFetch } from './useFetch';
// import { baseUrL } from '@/env/URLs';

// export interface Permission {
//   id: string;
//   name: string;
//   description?: string;
//   category: string;
// }

// export interface PermissionByCategory {
//   category: string;
//   permissions: Permission[];
// }

// export interface Role {
//   id: string;
//   name: string;
//   description?: string;
//   permissions: Permission[];
// }

// export const useRoleManagement = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [permissionsByCategory, setPermissionsByCategory] = useState<PermissionByCategory[]>([]);

//   // Fetch roles
//   const {
//     data: rolesResponse,
//     isLoading: rolesLoading,
//     error: rolesError,
//     callApi: fetchRoles
//   } = useFetch("GET", null, `${baseUrL}/roles?page=0&size=1000`);

//   // Fetch permissions by category
//   const {
//     data: permissionsResponse,
//     isLoading: permissionsLoading,
//     error: permissionsError,
//     callApi: fetchPermissions
//   } = useFetch("GET", null, `${baseUrL}/get-permission-by-category?page=0&size=1000`);

//   // Create role
//   const {
//     callApi: createRole,
//     isLoading: creatingRole,
//     error: createError
//   } = useFetch("POST");

//   // Update role permissions
//   const {
//     callApi: updateRole,
//     isLoading: updatingRole,
//     error: updateError
//   } = useFetch("PATCH");

//   useEffect(() => {
//     if (rolesResponse?.data?.data) {
//       setRoles(rolesResponse.data.data);
//     }
//   }, [rolesResponse]);

//   useEffect(() => {
//     if (permissionsResponse?.data?.data) {
//       setPermissionsByCategory(permissionsResponse.data.data);
//     }
//   }, [permissionsResponse]);

//   const handleCreateRole = async (roleData: { name: string; description: string; permissions: string[] }) => {
//     return await createRole(`${baseUrL}/create-role`, roleData);
//   };

//   const handleUpdateRole = async (roleName: string, permissions: string[]) => {
//     const updateData = { permissions };
//     return await updateRole(
//       `${baseUrL}/update-role-add-permission?role-name=${encodeURIComponent(roleName)}`,
//       updateData
//     );
//   };

//   return {
//     roles,
//     permissionsByCategory,
//     rolesLoading,
//     permissionsLoading,
//     rolesError,
//     permissionsError,
//     creatingRole,
//     updatingRole,
//     createError,
//     updateError,
//     fetchRoles,
//     fetchPermissions,
//     handleCreateRole,
//     handleUpdateRole
//   };
// };