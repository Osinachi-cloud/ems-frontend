"use client";

import { formatNumberToNaira } from "@/app/utils/moneyUtils";
// Importing components that were already in your original file
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import { TransactionTable } from "@/components/TransactionTable";
import UserCard from "@/components/UserCard";
import Image from "next/image";
import { useState } from "react";
import PaymentModal from "./paymentModal";
import { useFetch } from "@/hooks/useFetch";
import { baseUrL } from "@/env/URLs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import "./page.css"
import TransactionsPage from "./transaction";

export const AdminPage = () => {
  const [feeAmount, setFeeAmount] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Add this state

  const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
  const email = getUserDetails()?.emailAddress
  const designation = getUserDetails()?.designation

  const lastPaidDate = new Date("2025-01-01");

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchUrl = `${baseUrL}/get-products-published?designation=${designation}&page=${0}&size=${100}`;

  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
    callApi: refetchproducts
  } = useFetch("GET", null, fetchUrl);

  const handlePayment = (months: Date[]) => {
    if (!selectedProduct) return;

    // 💡 Implement your actual payment logic here
    console.log("Initiating payment for product:", selectedProduct);
    console.log("Payment for months:", months);

    const totalAmount = months.length * selectedProduct.price;
    console.log(`Total amount due: ${formatNumberToNaira(totalAmount)}`);

    closeModal();
  };

  return (
    <>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full flex flex-col gap-8">
          {/* USER CARDS */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome, Alex SuperAdmin!</h1>
            <h6 className="text-xl text-teal-600 mb-4">Role: SuperAdmin</h6>
          </div>
          <div>
          </div>
          <div className="grid md:grid-cols-5 gap-2">
            <UserCard country="My Total Paid" customerCount={120000} />
            <UserCard country="Nigeria" customerCount={12} />
            <UserCard country="Canada" customerCount={1000} />
            <UserCard country="China" customerCount={2000} />

            <div className="col-span-full mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {productsResponse?.data?.data?.map((product: any) => (
                  <div
                    key={product.productId}
                    className="bg-white p-4 rounded-lg shadow-md border border-teal-100 hover:shadow-lg transition duration-200"
                  >
                    <h2 className="text-xs font-semibold text-gray-700 mb-2 line-clamp-1">
                      {product.name}
                    </h2>
                    <div className="mb-3 text-gray-600">
                      <p className="font-bold text-teal-600 text-sm">
                        {formatNumberToNaira(product.price)}
                      </p>
                      <p className="text-xs mt-1 line-clamp-2">{product.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Code: {product.code}</p>
                    </div>
                    <button
                      onClick={() => openModal(product)}
                      className="w-full px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-xs text-white font-semibold rounded-md shadow hover:shadow-teal-400/50 transition duration-200"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TransactionsPage />


          {/* <div className="w-full h-[350px] grid md:grid-cols-5 gap-[2rem]">
            <div className="col-span-2 px-[2rem] py-[2rem] h-fit bg-[#fff] rounded-[8px]">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Image src="/trans-icon.png" height={10} width={30} alt="Transaction Icon" />
                  <p>Total Transaction</p>
                </div>
                <div>
                  <select className="bg-[#F6F8FF]" name="" id="">
                    <option value="">Month</option>
                    <option value="">Year</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-[3rem]">
                <h1 className="text-[40px] font-bold">N5,000,000</h1>
                <Image src="/trans-icon.png" height={50} width={150} alt="Transaction Icon" />
              </div>
            </div>
            <div className="col-span-3">
              
              <FinanceChart />
            </div>
          </div>
          <div>
            <TransactionTable />
          </div> */}
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        feeAmount={selectedProduct?.price || 0} // Use selected product price
        lastPaidDate={lastPaidDate}
        onPayment={handlePayment}
        transaction_charge={100} // You can keep this fixed or make it dynamic
        productId={selectedProduct?.productId?.toString()} // Use selected product ID
        productName={selectedProduct?.name} // Pass product name if needed
      />
    </>
  );
};

export default AdminPage;