"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Filter, Download, Eye, Loader2, Calendar, X, CheckCircle, Clock, XCircle, DollarSign, User, Zap } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { baseUrL } from '@/env/URLs';
import { Transaction, TransactionFilters, TransactionStatus } from '@/types/transaction';
import { formatDate } from '@/app/utils/dateUtils';
import { Modal } from '../inventory/modal';
// import { PaginationControls } from './pagination';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PaginationControls } from '../my-dashboard/pagination';

const ITEMS_PER_PAGE = 10;

interface CompactReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  getStatusColor: (status: TransactionStatus) => string;
  downloadTransaction: (transaction: Transaction) => void;
}

const CompactReceiptModal: React.FC<CompactReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  getStatusColor,
  downloadTransaction
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Move useMemo hooks to the top - always call them unconditionally
  const { icon: StatusIcon, colorClass } = useMemo(() => {
    if (!transaction) {
      return { icon: Zap, colorClass: 'text-gray-500 bg-gray-50' };
    }
    
    switch (transaction.status) {
      case TransactionStatus.SUCCESS:
        return { icon: CheckCircle, colorClass: 'text-green-500 bg-green-50' };
      case TransactionStatus.PENDING:
        return { icon: Clock, colorClass: 'text-yellow-500 bg-yellow-50' };
      case TransactionStatus.FAILED:
        return { icon: XCircle, colorClass: 'text-red-500 bg-red-50' };
      default:
        return { icon: Zap, colorClass: 'text-gray-500 bg-gray-50' };
    }
  }, [transaction?.status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const formattedAmount = `$${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}`;
  const formattedDate = formatDate(transaction.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto transform transition-all"
      >

        <div className={`p-4 ${colorClass} rounded-t-xl`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-5 h-5" />
              <span className="font-semibold text-gray-900 capitalize">{transaction.status}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition p-1 rounded-full hover:bg-white/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumberToNaira(transaction.amount)}</p>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Product</span>
            <span className="text-sm text-gray-900">{transaction.productName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">User ID</span>
            <span className="text-sm font-mono text-gray-900">{transaction.userId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Reference</span>
            <span className="text-sm font-mono text-gray-900">{transaction.reference}</span>
          </div>
          {transaction.description && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Description</span>
              <span className="text-[10px] text-gray-900 text-right max-w-[200px] break-words">
                {transaction.description}
              </span>
            </div>
          )}
        </div>

        {(transaction.subscribeFrom || transaction.subscribeTo) && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">Subscription Period</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <p className="font-medium text-blue-700">Start</p>
                <p className="text-gray-700">{formatDate(transaction.subscribeFrom)}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="font-medium text-blue-700">End</p>
                <p className="text-gray-700">{formatDate(transaction.subscribeTo)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => downloadTransaction(transaction)}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

const generatePDFReceipt = (transaction: Transaction) => {
  const formattedAmount = `$${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}`;
  const formattedDate = formatDate(transaction.createdAt);
  
  // Create PDF content
  const pdfContent = `
    SYNPAY TRANSACTION RECEIPT
    =========================
    
    Reference: ${transaction.reference}
    Transaction ID: ${transaction.transactionId}
    Date: ${formattedDate}
    Status: ${transaction.status.toUpperCase()}
    
    -------------------------
    PRODUCT DETAILS
    -------------------------
    Product: ${transaction.productName}
    User ID: ${transaction.userId}
    ${transaction.description ? `Description: ${transaction.description}` : ''}
    
    -------------------------
    PAYMENT INFORMATION
    -------------------------
    Total Amount: ${formattedAmount}
    
    ${transaction.subscribeFrom || transaction.subscribeTo ? `
    -------------------------
    SUBSCRIPTION DETAILS
    -------------------------
    ${transaction.subscribeFrom ? `Start Date: ${formatDate(transaction.subscribeFrom)}` : ''}
    ${transaction.subscribeTo ? `End Date: ${formatDate(transaction.subscribeTo)}` : ''}
    ` : ''}
    
    =========================
    Thank you for your business!
    Generated on: ${new Date().toLocaleDateString()}
  `;

  // Create blob and download
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${transaction.reference}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const TransactionsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [tempFilters, setTempFilters] = useState<TransactionFilters>({});

  const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
  

  // Build URL with filters and pagination
  const buildFetchUrl = () => {
    const params = new URLSearchParams();
    params.append('estateId', getUserDetails()?.estateId.toString() + "");
    params.append('page', (currentPage - 1).toString());
    params.append('size', ITEMS_PER_PAGE.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return `${baseUrL}/get-transactions?${params.toString()}`;
  };

  const fetchUrl = buildFetchUrl();

  const {
    data: transactionsResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
    callApi: refetchTransactions
  } = useFetch("GET", null, fetchUrl);

  const paginatedTransactions = transactionsResponse?.data?.data || [];
  const transactionCount = transactionsResponse?.data?.total || 0;
  const totalPages = Math.ceil(transactionCount / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterApply = () => {
    setFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    setIsFilterOpen(false);
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
  };

  const downloadTransaction = (transaction: Transaction) => {
    generatePDFReceipt(transaction);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return 'bg-green-100 text-green-800 border border-green-200';
      case TransactionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case TransactionStatus.FAILED:
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Transaction History</h1>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search and Quick Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference..."
                value={filters.reference || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, reference: e.target.value }))}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as TransactionStatus }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
            >
              <option value="">All Status</option>
              {Object.values(TransactionStatus).map(status => (
                <option key={status} value={status} className="capitalize">{status}</option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => {
              setTempFilters(filters);
              setIsFilterOpen(true);
            }}
            className="flex items-center px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150 font-medium"
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).some(key => filters[key as keyof TransactionFilters]) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <span className="capitalize">{key}:</span> {value}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, [key]: undefined }))}
                    className="ml-2 text-blue-500 hover:text-blue-700 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setFilters({})}
              className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        onClose={() => setIsFilterOpen(false)}
        title="Filter Transactions"
        isModalOpen={isFilterOpen}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={tempFilters.productName || ''}
                onChange={(e) => handleFilterChange('productName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                value={tempFilters.userId || ''}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={tempFilters.fromDate || ''}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={tempFilters.toDate || ''}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
            <button
              onClick={handleFilterReset}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              Reset
            </button>
            <button
              onClick={handleFilterApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading/Error States */}
      {transactionsLoading && (
        <div className="text-center py-10 text-blue-600">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
          <p className="font-semibold">Loading transactions...</p>
        </div>
      )}
      {transactionsError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center shadow-sm">
          <p className="font-semibold">Error fetching transactions: {transactionsError}</p>
          <button onClick={() => refetchTransactions()} className="text-sm underline mt-2 text-red-600 hover:text-red-800">Try Again</button>
        </div>
      )}

      {/* Transaction Table */}
      {!transactionsLoading && !transactionsError && (
        <>
          <div className="bg-white rounded-xl shadow-xl overflow-x-auto border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedTransactions.map((transaction: Transaction, index: number) => (
                  <tr
                    key={transaction.transactionId}
                    className="hover:bg-blue-50/50 transition duration-150"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {transaction.reference}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {formatNumberToNaira(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-medium">
                      {transaction.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                      {transaction.userId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openTransactionDetails(transaction)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition"
                          aria-label={`View ${transaction.reference}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadTransaction(transaction)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition"
                          aria-label={`Download ${transaction.reference}`}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500 text-lg">
                      {transactionCount === 0 ? "No transactions found." : "No transactions match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            recordCount={transactionCount}
            totalPages={totalPages}
            responseLoading={transactionsLoading}
          />
        </>
      )}
      
      <CompactReceiptModal
        isOpen={!!selectedTransaction}
        onClose={closeTransactionDetails}
        transaction={selectedTransaction}
        getStatusColor={getStatusColor}
        downloadTransaction={downloadTransaction}
      />
    </div>
  );
};

export default TransactionsPage;