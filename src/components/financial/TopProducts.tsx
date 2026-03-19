// components/financial/TopProducts.tsx
import React from 'react';
import { ProductBreakdown } from '@/types/financial';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';
import { Award, TrendingUp } from 'lucide-react';

interface TopProductsProps {
    products: ProductBreakdown[] | undefined;
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-500 text-center">No product data available</p>
            </div>
        );
    }

    // Sort by completed revenue and take top 3
    const topProducts = [...products]
        .sort((a, b) => b.completedRevenue - a.completedRevenue)
        .slice(0, 3);

    return (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl shadow-sm border border-teal-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            </div>
            <div className="space-y-4">
                {topProducts.map((product, index) => {
                    const colors = [
                        'from-yellow-400 to-yellow-500',
                        'from-gray-300 to-gray-400',
                        'from-amber-600 to-amber-700',
                    ];
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';

                    return (
                        <div key={product.productName} className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center text-white font-bold text-sm`}>
                                {medal}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-gray-900">{product.productName}</span>
                                    <span className="text-sm font-bold text-teal-600">
                                        {formatNumberToNaira(product.completedRevenue)}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                                    <span>{product.transactionCount} transactions</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};