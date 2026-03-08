// types/financial.ts
export interface FinancialReportSummary {
    totalCompletedRevenue: number;
    totalFailedAmount: number;
    totalProcessingAmount: number | null;
    totalTransactionCount: number;
    completedTransactionCount: number;
    failedTransactionCount: number;
    processingTransactionCount: number | null;
    rejectedTransactionCount: number | null;
    averageTransactionAmount: number;
    dateRangeLabel: string;
    generatedAt: string;
    productBreakdown: ProductBreakdown[];
    designationBreakdown: DesignationBreakdown[];
    monthlyTrend: MonthlyTrend[];
}

export interface ProductBreakdown {
    productName: string;
    transactionCount: number;
    completedRevenue: number;
    failedAmount: number;
    processingAmount: number;
}

export interface DesignationBreakdown {
    designation: string;
    transactionCount: number;
    completedRevenue: number;
    failedAmount: number;
}

export interface MonthlyTrend {
    month: string;
    monthLabel: string;
    transactionCount: number;
    completedRevenue: number;
    failedAmount: number;
    processingAmount: number;
}

export interface FinancialReportFilters {
    estateId?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    designation?: string;
    productName?: string;
    userId?: string;
}

export const DESIGNATIONS = [
    { value: 'LANDLORD', label: '🏠 Landlord' },
    { value: 'TENANT', label: '👤 Tenant' },
    { value: 'OCCUPANT', label: '👨‍👩‍👧‍👦 Occupant' },
    { value: 'EXTERNAL', label: '🌐 External' },
];

export const TRANSACTION_STATUSES = [
    { value: 'SUCCESS', label: '✅ Success' },
    { value: 'PENDING', label: '⏳ Pending' },
    { value: 'FAILED', label: '❌ Failed' },
];