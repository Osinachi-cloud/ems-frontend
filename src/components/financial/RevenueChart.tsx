// components/financial/RevenueChart.tsx
import React from 'react';
import { MonthlyTrend } from '@/types/financial';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RevenueChartProps {
    data: MonthlyTrend[] | undefined;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-gray-500">No monthly trend data available</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...data.map(item => item.completedRevenue));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trend</h3>
            <div className="space-y-4">
                {data.map((item, index) => {
                    const percentage = maxRevenue > 0 ? (item.completedRevenue / maxRevenue) * 100 : 0;
                    const previousRevenue = (index > 0 ? data[index - 1]?.completedRevenue : item.completedRevenue) || 0;
                    const trend = item.completedRevenue > previousRevenue ? 'up' : 
                                 item.completedRevenue < previousRevenue ? 'down' : 'same';
                    
                    return (
                        <div key={item.month} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-700">{item.monthLabel}</span>
                                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                    {trend === 'same' && <Minus className="w-4 h-4 text-gray-400" />}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-semibold text-gray-900">
                                        {new Intl.NumberFormat('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(item.completedRevenue)}
                                    </span>
                                    <span className="text-xs text-gray-500 w-12 text-right">
                                        {item.transactionCount} txns
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            {item.failedAmount > 0 && (
                                <div className="text-xs text-red-500">
                                    Failed: {new Intl.NumberFormat('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                        minimumFractionDigits: 0
                                    }).format(item.failedAmount)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};