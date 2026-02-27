"use client";

import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import UserCard from "@/components/UserCard";
import { useState, useEffect, useMemo } from "react";
import PaymentModal from "./paymentModal";
import { useFetch } from "@/hooks/useFetch";
import { baseUrL } from "@/env/URLs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import "./page.css"
import TransactionsPage from "./transaction";

const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Date filter state - initially empty to use backend defaults
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: ""
  });

  const { getUserDetails } = useLocalStorage("userDetails", null);
  const email = getUserDetails()?.emailAddress;
  const designation = getUserDetails()?.designation;

  // Build the API URL with current date range (only include dates if they exist)
  // const buildTransactionStatsUrl = () => {
  //   let url = `${baseUrL}/get-user-transaction-stats?email=${email}`;
  //   if (dateRange.fromDate) url += `&fromDate=${dateRange.fromDate}`;
  //   if (dateRange.toDate) url += `&toDate=${dateRange.toDate}`;
  //   return url;
  // };

  // // Use the useFetch hook for transaction stats
  // const {
  //   data: transactionStats,
  //   isLoading: statsLoading,
  //   error: statsError,
  //   callApi: refetchStats
  // } = useFetch("GET", null, buildTransactionStatsUrl());

  // const fetchUrl = `${baseUrL}/get-products-published?designation=${designation}&page=${0}&size=${100}`;

  // const {
  //   data: productsResponse,
  //   isLoading: productsLoading,
  //   error: productsError,
  // } = useFetch("GET", null, fetchUrl);




  // ✅ FIX: Memoize the URLs
  const transactionStatsUrl = useMemo(() => {
    let url = `${baseUrL}/get-user-transaction-stats?email=${email}`;
    if (dateRange.fromDate) url += `&fromDate=${dateRange.fromDate}`;
    if (dateRange.toDate) url += `&toDate=${dateRange.toDate}`;
    return url;
  }, [email, dateRange.fromDate, dateRange.toDate]); // Only changes when these change

  const productsUrl = useMemo(() =>
    `${baseUrL}/get-published-products-payments-by-users?designation=${designation}&page=${0}&size=${100}`,
    [designation]
  );

  // Now use the memoized URLs
  const {
    data: transactionStats,
    isLoading: statsLoading,
    error: statsError,
    callApi: refetchStats
  } = useFetch("GET", null, transactionStatsUrl);

  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
  } = useFetch("GET", null, productsUrl);

  const lastPaidDate = transactionStats?.data?.lastPaid ? new Date(transactionStats.data.lastPaid) : null;

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };



  const handlePayment = (months: Date[]) => {
    if (!selectedProduct) return;

    console.log("Initiating payment for product:", selectedProduct);
    console.log("Payment for months:", months);

    const totalAmount = months.length * selectedProduct.price;
    console.log(`Total amount due: ${formatNumberToNaira(totalAmount)}`);

    closeModal();
  };

  // Handle date filter changes
  const handleDateFilterChange = (field: 'fromDate' | 'toDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateRange({
      fromDate: "",
      toDate: ""
    });
  };

  // Check if any date filter is active
  const isDateFilterActive = dateRange.fromDate || dateRange.toDate;

  return (
    <>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full flex flex-col gap-8">
          {/* USER CARDS */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome, {getUserDetails()?.firstName} {getUserDetails()?.lastName}</h1>
            <h6 className="text-xl text-teal-600 mb-4">Role: {getUserDetails()?.roleDto?.name}</h6>
          </div>

          {/* Elegant Date Filter */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-teal-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Filter Transactions by Date
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
                    <input
                      type="date"
                      value={dateRange.fromDate}
                      onChange={(e) => handleDateFilterChange('fromDate', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
                    <input
                      type="date"
                      value={dateRange.toDate}
                      onChange={(e) => handleDateFilterChange('toDate', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                  {isDateFilterActive && (
                    <div className="sm:self-end">
                      <button
                        onClick={clearDateFilters}
                        className="px-4 py-2 text-xs bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                {isDateFilterActive && (
                  <div className="mt-2 text-xs text-teal-600">
                    {dateRange.fromDate && dateRange.toDate
                      ? `Showing transactions from ${new Date(dateRange.fromDate).toLocaleDateString()} to ${new Date(dateRange.toDate).toLocaleDateString()}`
                      : dateRange.fromDate
                        ? `Showing transactions from ${new Date(dateRange.fromDate).toLocaleDateString()} onwards`
                        : `Showing transactions up to ${new Date(dateRange.toDate).toLocaleDateString()}`
                    }
                  </div>
                )}
                {!isDateFilterActive && (
                  <div className="mt-2 text-xs text-gray-500">
                    Showing all transactions (using backend default date range)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {/* Transaction Stats Cards */}
            {statsLoading ? (
              <>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </>
            ) : statsError ? (
              <>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
                  <p className="text-red-600 text-sm">Error loading stats</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
                  <p className="text-red-600 text-sm">Error loading stats</p>
                </div>
              </>
            ) : (
              <>
                <UserCard
                  label="Total Amount Paid"
                  value={formatNumberToNaira(transactionStats?.data?.totalAmountPaid) || 0}
                  isAmount={true}
                  bgColor={"teal"}
                />
                <UserCard
                  label="Last Payment Date"
                  value={transactionStats?.data?.lastPaid ?
                    new Date(transactionStats.data.lastPaid).toLocaleDateString() :
                    "No payments"
                  }
                  isDate={true}
                  bgColor={"cyan"}
                />
              </>
            )}

            {/* Existing country cards */}
            {/* <UserCard label="Nigeria" value={12} />
            <UserCard label="Canada" value={1000} />
            <UserCard label="China" value={2000} /> */}

            <div className="col-span-full mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {productsResponse?.data?.data?.map((product: any) => (
                  <div
                    key={product.productId}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all duration-200"
                  >
                    <h2 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1">
                      {product.name}
                    </h2>
                    <div className="mb-3 text-gray-600">
                      <p className="font-bold text-teal-600 text-sm">
                        {formatNumberToNaira(product.price)}
                      </p>
                      <p className="text-xs mt-1 line-clamp-2 text-gray-500">{product.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Code: {product.code}</p>
                    </div>
                    <button
                      onClick={() => openModal(product)}
                      className="w-full px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-xs text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TransactionsPage />
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        feeAmount={selectedProduct?.price || 0}
        lastPaidDate={selectedProduct?.lastPaid}
        onPayment={handlePayment}
        transaction_charge={100}
        productId={selectedProduct?.productId?.toString()}
        productName={selectedProduct?.name}
        product={selectedProduct}
      />
    </>
  );
};

export default AdminPage;