import { SearchFilters } from "@/types/reponse";
import { Search } from "lucide-react";
import React from "react";

export const initialFilters: SearchFilters = {
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    isActive: '',
};

export const SearchFilterComponent: React.FC<{
    filters: SearchFilters;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    applySearch: (e: React.FormEvent) => void;
}> = React.memo(({ filters, handleFilterChange, applySearch }) => (
    <form onSubmit={applySearch} className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">User Search Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={filters.firstName}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={filters.lastName}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={filters.email.replace("%40", "")}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />

            <select
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 appearance-none"
            >
                <option value="">Active Status (All)</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>

            <input
                type="text"
                name="roleId"
                placeholder="Role ID"
                value={filters.roleId}
                onChange={handleFilterChange}
                className="px-3 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
        </div>
        <div className="mt-4 text-right">
            <button
                type="submit"
                className="flex items-center ml-auto px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
            >
                <Search className="w-5 h-5 mr-2" />
                Search Users
            </button>
        </div>
    </form>
));