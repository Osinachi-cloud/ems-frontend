
export interface InputFieldProps {
    name: keyof { firstName: string, lastName: string, enabled: boolean },
    label: string,
    type?: string,
    error?: string,
    value: string | number | boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    disabled: boolean;
}

export interface Response {
    error?: string | null;
    message?: string | any;
    statusCode?: number;
    data?: any;
    success?: boolean | null;
}

export interface SearchFilters {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    isActive: string;
}

export interface RoleDto { name: string; 
    description: string; 
}

export interface UserDto {
    userId: string; 
    firstName: string; 
    lastName: string; 
    middleName: string | null;
    email: string; 
    phoneNumber: string; 
    enabled: boolean; 
    role: RoleDto | null; 
    designation: string; 
    landlordId: string | null; 
    tenantId: string | null;
    color: string | null;
}

export interface BaseResponse<T> { 
    success?: boolean; 
    message?: string; 
    statusCode?: number; 
    error?: string | null; 
    timestamp?: string; 
    data?: T; 
}

export interface PaginatedResponse<T> { 
    data: T; 
    page: number; 
    size: number; 
    total: number;
 }
