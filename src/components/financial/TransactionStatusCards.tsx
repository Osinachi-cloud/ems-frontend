// components/financial/TransactionStatusCards.tsx
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { FinancialReportSummary } from '@/types/financial';

interface TransactionStatusCardsProps {
    summary: FinancialReportSummary | null;
}

export const TransactionStatusCards: React.FC<TransactionStatusCardsProps> = ({ summary }) => {
    if (!summary) return null;

    const statusCards = [
        {
            label: 'Completed',
            value: summary.completedTransactionCount,
            amount: summary.totalCompletedRevenue,
            icon: CheckCircle,
            bgColor: 'from-green-500 to-emerald-600',
            iconColor: 'text-green-600',
            bgLight: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            label: 'Failed',
            value: summary.failedTransactionCount,
            amount: summary.totalFailedAmount,
            icon: XCircle,
            bgColor: 'from-red-500 to-rose-600',
            iconColor: 'text-red-600',
            bgLight: 'bg-red-50',
            borderColor: 'border-red-200'
        },
        {
            label: 'Processing',
            value: summary.processingTransactionCount || 0,
            amount: summary.totalProcessingAmount || 0,
            icon: Clock,
            bgColor: 'from-yellow-500 to-amber-600',
            iconColor: 'text-yellow-600',
            bgLight: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        {
            label: 'Rejected',
            value: summary.rejectedTransactionCount || 0,
            amount: 0,
            icon: AlertCircle,
            bgColor: 'from-gray-500 to-gray-600',
            iconColor: 'text-gray-600',
            bgLight: 'bg-gray-50',
            borderColor: 'border-gray-200'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statusCards.map((card, index) => {
                const Icon = card.icon;
                const percentage = summary.totalTransactionCount > 0 
                    ? ((card.value / summary.totalTransactionCount) * 100).toFixed(1)
                    : '0';

                return (
                    <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm border ${card.borderColor} p-5 hover:shadow-md transition-all duration-300`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${card.bgLight}`}>
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-500">{percentage}%</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                        <p className="text-sm text-gray-600 mb-1">{card.label} Transactions</p>
                        {card.amount > 0 && (
                            <p className="text-xs font-medium text-teal-600">
                                {new Intl.NumberFormat('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN',
                                    minimumFractionDigits: 0
                                }).format(card.amount)}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};