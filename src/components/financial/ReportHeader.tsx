// components/financial/ReportHeader.tsx
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { FinancialReportSummary } from '@/types/financial';

interface ReportHeaderProps {
    summary: FinancialReportSummary | null;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ summary }) => {
    if (!summary) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="text-gray-600">Period:</span>
                        <span className="font-semibold text-gray-900">{summary.dateRangeLabel}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span className="text-gray-600">Generated:</span>
                        <span className="font-semibold text-gray-900">{summary.generatedAt}</span>
                    </div>
                </div>
                <div className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                    {summary.totalTransactionCount} Total Transactions
                </div>
            </div>
        </div>
    );
};