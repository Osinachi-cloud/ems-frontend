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
// Import the new PaymentModal component
// import PaymentModal from "@/components/PaymentModal"; 

export const AdminPage = () => {
  const [feeAmount, setFeeAmount] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 🌟 MOCK DATA for last paid date - Replace this with actual backend fetch
  const lastPaidDate = new Date("2025-06-01"); // Example: Last paid in June 2025

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePayment = (months: Date[]) => {
    // 💡 Implement your actual payment logic here
    console.log("Initiating payment for the following months:", months);
    // Calculate total amount: months.length * feeAmount
    const totalAmount = months.length * feeAmount;
    console.log(`Total amount due: ${formatNumberToNaira(totalAmount)}`);

    // After successful payment:
    // 1. Update the lastPaidDate state/backend.
    // 2. Close the modal.
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
          <div className="grid md:grid-cols-5 gap-2">
            <UserCard country="My Total Paid" customerCount={120000} />
            <UserCard country="Nigeria" customerCount={12} />
            <UserCard country="Canada" customerCount={1000} />
            <UserCard country="China" customerCount={2000} />

            {feeAmount > 0 && (
              <div className="bg-white px-6 py-4 rounded-xl shadow-lg border border-teal-200 hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                <h2 className="text-sm font-semibold text-gray-700 mb-4 whitespace-nowrap">Monthly Fee</h2>
                <div className="mb-4 text-gray-600">
                  <p>Your fee: <span className="font-bold text-teal-600">{formatNumberToNaira(feeAmount)}</span></p>
                  <p className="text-xs text-gray-400">Last paid: {lastPaidDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <button
                  onClick={openModal} // 👈 Opens the modal
                  className="w-full px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-sm text-white font-bold rounded-lg shadow-lg hover:shadow-teal-400/50 transition duration-300 transform hover:scale-[1.05]"
                >
                  Pay Now
                </button>
              </div>
            )}
            {/* ... other UserCard components ... */}
          </div>
          {/* ... other charts and tables (omitted for brevity) ... */}
          
          <div className="w-full h-[350px] grid md:grid-cols-5 gap-[2rem]">
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
          </div>
        </div>
        {/* ... RIGHT section (omitted for brevity) ... */}
      </div>

      {/* 🔮 Payment Modal Component */}
      <PaymentModal

      
        isOpen={isModalOpen}
        onClose={closeModal}
        feeAmount={feeAmount}
        lastPaidDate={lastPaidDate}
        onPayment={handlePayment}
      />
    </>
  );
};

export default AdminPage;