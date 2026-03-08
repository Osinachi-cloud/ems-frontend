// components/financial/FinancialStatsCards.tsx
import React from 'react';
import { 
    TrendingUp, 
    DollarSign, 
    CreditCard, 
    BarChart3,
    Clock,
    XCircle,
    CheckCircle
} from 'lucide-react';
import { FinancialReportSummary } from '@/types/financial';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';

interface FinancialStatsCardsProps {
    summary: FinancialReportSummary | null;
    isLoading: boolean;
}

export const FinancialStatsCards: React.FC<FinancialStatsCardsProps> = ({ summary, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!summary) return null;

    const stats = [
        {
            label: 'Total Completed Revenue',
            value: formatNumberToNaira(summary.totalCompletedRevenue),
            icon: DollarSign,
            bgColor: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            label: 'Total Transactions',
            value: summary.totalTransactionCount,
            icon: CreditCard,
            bgColor: 'from-blue-500 to-indigo-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            label: 'Avg Transaction Amount',
            value: formatNumberToNaira(summary.averageTransactionAmount),
            icon: BarChart3,
            bgColor: 'from-purple-500 to-violet-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            label: 'Success Rate',
            value: summary.totalTransactionCount > 0 
                ? `${((summary.completedTransactionCount / summary.totalTransactionCount) * 100).toFixed(1)}%`
                : '0%',
            icon: TrendingUp,
            bgColor: 'from-amber-500 to-orange-600',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};