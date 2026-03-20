// components/financial/FilterBar.tsx
import React, { useState, useEffect } from 'react';
import { Filter, Search, X, Download, Loader2, Calendar } from 'lucide-react';
import { FinancialReportFilters, DESIGNATIONS, TRANSACTION_STATUSES } from '@/types/financial';
import { getDefaultDateRange } from '@/app/utils/dateUtils';

interface FilterBarProps {
    filters: FinancialReportFilters;
    onFilterChange: (filters: FinancialReportFilters) => void;
    onExport: () => void;
    isExporting: boolean;
    activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    onFilterChange,
    onExport,
    isExporting,
    activeFilterCount
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState<FinancialReportFilters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value || undefined }));
    };

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
        setIsExpanded(false);
    };

    const handleResetFilters = () => {
        const defaultRange = getDefaultDateRange();
        const resetFilters = {
            fromDate: defaultRange.fromDate,
            toDate: defaultRange.toDate
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const handleClearFilter = (key: keyof FinancialReportFilters) => {
        const newFilters = { ...localFilters, [key]: undefined };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const formatDisplayValue = (key: string, value: string) => {
        if (key === 'fromDate' || key === 'toDate') {
            return new Date(value).toLocaleDateString();
        }
        return value;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Filter className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-800">Financial Report Filters</h2>
                        <p className="text-xs text-gray-500">Filter transactions and generate reports</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onExport();
                        }}
                        disabled={isExporting}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isExporting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <>
                                <Download className="w-3.5 h-3.5" />
                                <span>Export Excel</span>
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                    <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-blue-500' : 'bg-gray-300'}`} />
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && !isExpanded && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value || key === 'estateId') return null;
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                            >
                                <span className="capitalize">{key}:</span> {formatDisplayValue(key, value)}
                                <button
                                    onClick={() => handleClearFilter(key as keyof FinancialReportFilters)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Expanded Filter Form */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">Date Range</label>
                            <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={localFilters.fromDate || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={localFilters.toDate || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">Transaction Status</label>
                            <select
                                name="status"
                                value={localFilters.status || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All Statuses</option>
                                {TRANSACTION_STATUSES.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Designation Filter */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">Designation</label>
                            <select
                                name="designation"
                                value={localFilters.designation || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All Designations</option>
                                {DESIGNATIONS.map(designation => (
                                    <option key={designation.value} value={designation.value}>
                                        {designation.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Product Name Filter */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={localFilters.productName || ''}
                                onChange={handleInputChange}
                                placeholder="Enter product name..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* User ID Filter */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">User ID</label>
                            <input
                                type="text"
                                name="userId"
                                value={localFilters.userId || ''}
                                onChange={handleInputChange}
                                placeholder="Enter user ID..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Estate ID (Hidden in UI but can be included) */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600">Estate ID</label>
                            <input
                                type="text"
                                name="estateId"
                                value={localFilters.estateId || ''}
                                onChange={handleInputChange}
                                placeholder="Enter estate ID..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reset to Default
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};