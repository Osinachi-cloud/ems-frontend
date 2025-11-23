// // app/role-management/simple-page.tsx (alternative simpler version)
// "use client";

// import { useState } from "react";
// import { useRoleManagement } from "@/hooks/useRoleManagement";
// // import RoleManagementUI from "./components/RoleManagementUI";

// const SimpleRoleManagementPage = () => {
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState<any>(null);
//   const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

//   const {
//     roles,
//     permissionsByCategory,
//     rolesLoading,
//     permissionsLoading,
//     creatingRole,
//     updatingRole,
//     handleCreateRole,
//     handleUpdateRole,
//     fetchRoles
//   } = useRoleManagement();

//   const handleCreateNewRole = async (roleData: { name: string; description: string }) => {
//     const permissionsArray = Array.from(selectedPermissions);
//     const result = await handleCreateRole({
//       ...roleData,
//       permissions: permissionsArray
//     });

//     if (result?.success) {
//       setIsCreateModalOpen(false);
//       setSelectedPermissions(new Set());
//       fetchRoles();
//     }
//   };

//   const handleEditRole = (role: any) => {
//     setSelectedRole(role);
//     setSelectedPermissions(new Set(role.permissions.map((p: any) => p.name)));
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateExistingRole = async () => {
//     if (!selectedRole) return;

//     const permissionsArray = Array.from(selectedPermissions);
//     const result = await handleUpdateRole(selectedRole.name, permissionsArray);

//     if (result?.success) {
//       setIsEditModalOpen(false);
//       setSelectedRole(null);
//       setSelectedPermissions(new Set());
//       fetchRoles();
//     }
//   };

//   const togglePermission = (permissionName: string) => {
//     setSelectedPermissions(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(permissionName)) {
//         newSet.delete(permissionName);
//       } else {
//         newSet.add(permissionName);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <RoleManagementUI
//       roles={roles}
//       permissionsByCategory={permissionsByCategory}
//       rolesLoading={rolesLoading}
//       permissionsLoading={permissionsLoading}
//       isCreateModalOpen={isCreateModalOpen}
//       isEditModalOpen={isEditModalOpen}
//       selectedRole={selectedRole}
//       selectedPermissions={selectedPermissions}
//       creatingRole={creatingRole}
//       updatingRole={updatingRole}
//       onOpenCreateModal={() => setIsCreateModalOpen(true)}
//       onCloseCreateModal={() => {
//         setIsCreateModalOpen(false);
//         setSelectedPermissions(new Set());
//       }}
//       onOpenEditModal={handleEditRole}
//       onCloseEditModal={() => {
//         setIsEditModalOpen(false);
//         setSelectedRole(null);
//         setSelectedPermissions(new Set());
//       }}
//       onCreateRole={handleCreateNewRole}
//       onUpdateRole={handleUpdateExistingRole}
//       onTogglePermission={togglePermission}
//     />
//   );
// };

// export default SimpleRoleManagementPage;