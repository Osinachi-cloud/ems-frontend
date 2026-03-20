// components/financial/BreakdownTables.tsx
import React, { useState } from 'react';
import { FinancialReportSummary, ProductBreakdown, DesignationBreakdown } from '@/types/financial';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';
import { ChevronDown, ChevronUp, Package, Users } from 'lucide-react';

interface BreakdownTablesProps {
    summary: FinancialReportSummary | null;
}

export const BreakdownTables: React.FC<BreakdownTablesProps> = ({ summary }) => {
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllDesignations, setShowAllDesignations] = useState(false);

    if (!summary) return null;

    const productsToShow = showAllProducts 
        ? summary.productBreakdown 
        : summary.productBreakdown.slice(0, 5);
    
    const designationsToShow = showAllDesignations 
        ? summary.designationBreakdown 
        : summary.designationBreakdown.slice(0, 5);

    const totalProductRevenue = summary.productBreakdown.reduce((sum, p) => sum + p.completedRevenue, 0);
    const totalDesignationRevenue = summary.designationBreakdown.reduce((sum, d) => sum + d.completedRevenue, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Product Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Revenue by Product</h3>
                    </div>
                    {summary.productBreakdown.length > 5 && (
                        <button
                            onClick={() => setShowAllProducts(!showAllProducts)}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                            {showAllProducts ? (
                                <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                            ) : (
                                <>Show All ({summary.productBreakdown.length}) <ChevronDown className="w-4 h-4 ml-1" /></>
                            )}
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {productsToShow.map((product) => {
                        const percentage = totalProductRevenue > 0 
                            ? ((product.completedRevenue / totalProductRevenue) * 100).toFixed(1)
                            : '0';
                        
                        return (
                            <div key={product.productName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-gray-900">{product.productName}</span>
                                        <span className="text-sm font-semibold text-blue-600">
                                            {formatNumberToNaira(product.completedRevenue)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{product.transactionCount} transactions</span>
                                        <span>{percentage}% of total</span>
                                    </div>
                                    {product.failedAmount > 0 && (
                                        <div className="text-xs text-red-500 mt-1">
                                            Failed: {formatNumberToNaira(product.failedAmount)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {productsToShow.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No product data available</p>
                    )}
                </div>
            </div>

            {/* Designation Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Revenue by Designation</h3>
                    </div>
                    {summary.designationBreakdown.length > 5 && (
                        <button
                            onClick={() => setShowAllDesignations(!showAllDesignations)}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                            {showAllDesignations ? (
                                <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                            ) : (
                                <>Show All ({summary.designationBreakdown.length}) <ChevronDown className="w-4 h-4 ml-1" /></>
                            )}
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {designationsToShow.map((item) => {
                        const percentage = totalDesignationRevenue > 0 
                            ? ((item.completedRevenue / totalDesignationRevenue) * 100).toFixed(1)
                            : '0';
                        
                        const getDesignationIcon = (designation: string) => {
                            switch(designation) {
                                case 'LANDLORD': return '🏠';
                                case 'TENANT': return '👤';
                                case 'OCCUPANT': return '👨‍👩‍👧‍👦';
                                case 'EXTERNAL': return '🌐';
                                default: return '📋';
                            }
                        };

                        return (
                            <div key={item.designation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-gray-900">
                                            {getDesignationIcon(item.designation)} {item.designation}
                                        </span>
                                        <span className="text-sm font-semibold text-blue-600">
                                            {formatNumberToNaira(item.completedRevenue)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{item.transactionCount} transactions</span>
                                        <span>{percentage}% of total</span>
                                    </div>
                                    {item.failedAmount > 0 && (
                                        <div className="text-xs text-red-500 mt-1">
                                            Failed: {formatNumberToNaira(item.failedAmount)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {designationsToShow.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No Category data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};