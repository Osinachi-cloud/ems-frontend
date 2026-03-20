"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet, Loader2, TrendingUp, Calendar, Download, Clock } from 'lucide-react';
import { useFetch, useDownload } from '@/hooks/useFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { baseUrL } from '@/env/URLs';
import { FinancialReportSummary, FinancialReportFilters } from '@/types/financial';
import { getDefaultDateRange } from '@/app/utils/dateUtils';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';
import { FilterBar } from '@/components/financial/FilterBar';
import { FinancialStatsCards } from '@/components/financial/FinancialStatsCards';
import { TransactionStatusCards } from '@/components/financial/TransactionStatusCards';
import { RevenueChart } from '@/components/financial/RevenueChart';
import { BreakdownTables } from '@/components/financial/BreakdownTables';
import { TopProducts } from '@/components/financial/TopProducts';

const FinancialReportsPage: React.FC = () => {
    const router = useRouter();
    const { getUserDetails } = useLocalStorage("userDetails", null);
    const { downloadExcel } = useDownload();

    const [isExporting, setIsExporting] = useState(false);
    const [filters, setFilters] = useState<FinancialReportFilters>(() => {
        const defaultRange = getDefaultDateRange();
        return {
            estateId: getUserDetails()?.estateId?.toString() || '',
            fromDate: defaultRange.fromDate,
            toDate: defaultRange.toDate
        };
    });

    // Build URL with current filters
    const buildReportUrl = useCallback(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.append(key, value.toString());
            }
        });

        return `${baseUrL}/get-financial-report-summary?${params.toString()}`;
    }, [filters]);

    const fetchUrl = buildReportUrl();

    // Fetch report data
    const {
        data: reportResponse,
        isLoading: reportLoading,
        error: reportError,
        callApi: refetchReport
    } = useFetch("GET", null, fetchUrl);

    const reportSummary: FinancialReportSummary | null = reportResponse?.data || null;

    // Calculate active filter count
    const activeFilterCount = useMemo(() => {
        return Object.entries(filters).filter(([key, value]) =>
            value && key !== 'estateId' &&
            (key === 'fromDate' || key === 'toDate' ? true : value)
        ).length;
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (newFilters: FinancialReportFilters) => {
        setFilters(newFilters);
    };

    // Handle export to Excel
    const handleExport = useCallback(async () => {
        setIsExporting(true);
        try {
            const exportUrl = new URL(`${baseUrL}/export-financial-report`, window.location.origin);

            // Add all current filters to export URL
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    exportUrl.searchParams.append(key, value.toString());
                }
            });

            const dateStr = new Date().toISOString().split('T')[0];
            const filterStr = activeFilterCount > 0 ? '_filtered' : '_full';
            const filename = `financial_report${filterStr}_${dateStr}.xlsx`;

            const result = await downloadExcel(exportUrl.toString(), filename);

            if (result.success) {
                console.log('Export successful:', result.filename);
            } else {
                console.error('Export failed:', result.error);
            }
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setIsExporting(false);
        }
    }, [filters, activeFilterCount, downloadExcel]);

    // Handle refresh
    const handleRefresh = () => {
        refetchReport();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Financial Reports</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Comprehensive financial analysis and transaction insights
                        </p>
                    </div>
                </div>

                {/* Date Range Display */}
                <div className="flex items-center space-x-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">
                        {filters.fromDate ? new Date(filters.fromDate).toLocaleDateString() : 'Start'} - {filters.toDate ? new Date(filters.toDate).toLocaleDateString() : 'End'}
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onExport={handleExport}
                isExporting={isExporting}
                activeFilterCount={activeFilterCount}
            />

            {/* Error State */}
            {reportError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                    <p className="font-semibold">Error loading report: {reportError}</p>
                    <button
                        onClick={handleRefresh}
                        className="text-sm underline mt-2 text-red-600 hover:text-red-800"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading State */}
            {reportLoading && (
                <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">Generating your financial report...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
            )}


            {!reportLoading && !reportError && reportSummary && (
                <>
                    {/* Report Header with date info */}
                    <div className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-semibold text-gray-900">{reportSummary.dateRangeLabel}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-gray-600">Generated:</span>
                                    <span className="font-semibold text-gray-900">{reportSummary.generatedAt}</span>
                                </div>
                            </div>
                            <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                {reportSummary.totalTransactionCount} Total Transactions
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <FinancialStatsCards summary={reportSummary} isLoading={reportLoading} />

                    {/* Transaction Status Cards */}
                    <TransactionStatusCards summary={reportSummary} />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                        {/* Left Column - Chart */}
                        <div className="lg:col-span-3">
                            <RevenueChart data={reportSummary.monthlyTrend} />
                        </div>

                        {/* Right Column - Top Products */}
                        <div className="lg:col-span-2">
                            <TopProducts products={reportSummary.productBreakdown} />
                        </div>
                    </div>

                    {/* Breakdown Tables */}
                    <BreakdownTables summary={reportSummary} />

                    {/* Summary Footer */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Report Period:</span>
                            <span className="text-sm font-semibold text-blue-700">
                                {reportSummary.dateRangeLabel}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Total Revenue:</span>
                                <span className="text-lg font-bold text-blue-700">
                                    {formatNumberToNaira(reportSummary.totalCompletedRevenue)}
                                </span>
                            </div>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                <span>Export Full Report</span>
                            </button>
                        </div>
                    </div>
                </>
            )}



            {/* No Data State */}
            {!reportLoading && !reportError && !reportSummary && (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                    <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Report Data Available</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        There's no transaction data available for the selected filters. Try adjusting your date range or filters.
                    </p>
                    <button
                        onClick={() => {
                            const defaultRange = getDefaultDateRange();
                            setFilters({
                                estateId: getUserDetails()?.estateId?.toString() || '',
                                fromDate: defaultRange.fromDate,
                                toDate: defaultRange.toDate
                            });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Reset to Default Range
                    </button>
                </div>
            )}
        </div>
    );
};

export default FinancialReportsPage;