"use client";

import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import { baseUrL } from "@/env/URLs";
import { usePost } from "@/hooks/usePost";
import { Calendar, X, CreditCard, CheckCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedbackMessage } from "../inventory/feedback";
import { Response } from "@/types/reponse";
import { useRouter } from "next/navigation";


// In your PaymentModal component props interface
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeAmount: number;
  lastPaidDate: Date | null;
  onPayment: (months: Date[]) => void;
  transaction_charge: number;
  productId: string;
  productName?: string; // Add this
}

// Then in your PaymentModal component, you can use productName

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  feeAmount,
  lastPaidDate,
  onPayment,
  transaction_charge,
  productId
}: any) => {
  const [selectedMonths, setSelectedMonths] = useState<Date[]>([]);
  const [availableMonths, setAvailableMonths] = useState<{ month: string, date: Date }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiPaymentResponse, setApiPaymentResponse] = useState<Response | null | undefined>(undefined);
  const [payStackSuccess, setPayStackSuccess] = useState<boolean>(false);

  // const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<"months" | "payment">("months");
  const router = useRouter();

  // Payment channels
  const paymentChannels = [
    { value: "card", label: "💳 Credit/Debit Card", description: "Pay with your card" },
    { value: "transfer", label: "🏦 Bank Transfer", description: "Direct bank transfer" },
    { value: "ussd", label: "📱 USSD", description: "Pay via USSD code" }
  ];

  // Calculate available months for payment
  useEffect(() => {
    if (isOpen) {
      const months = [];
      const currentDate = new Date();
      let startDate = new Date(lastPaidDate);

      // Start from the next month after last paid date
      startDate.setMonth(startDate.getMonth() + 1);

      while (startDate <= currentDate) {
        const monthName = startDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        months.push({
          month: monthName,
          date: new Date(startDate)
        });

        // Move to next month
        startDate.setMonth(startDate.getMonth() + 1);
      }

      setAvailableMonths(months);
      // Auto-select the first month by default
      setSelectedMonths(months.length > 0 ? [months[0].date] : []);
      // setPaymentSuccess(false);
      setPaymentStep("months");
      setSelectedChannel("");
    }
  }, [isOpen, lastPaidDate]);

  const toggleMonthSelection = (monthDate: Date) => {
    setSelectedMonths(prev => {
      const isSelected = prev.some(d => d.getTime() === monthDate.getTime());

      if (isSelected) {
        // If deselecting, remove this month and all months after it
        const monthIndex = availableMonths.findIndex(m => m.date.getTime() === monthDate.getTime());
        return prev.filter(d => {
          const dIndex = availableMonths.findIndex(m => m.date.getTime() === d.getTime());
          return dIndex < monthIndex;
        });
      } else {
        // Get the index of the clicked month
        const clickedIndex = availableMonths.findIndex(m => m.date.getTime() === monthDate.getTime());

        // Get the index of the last selected month
        const lastSelectedIndex = prev.length > 0
          ? Math.max(...prev.map(d =>
            availableMonths.findIndex(m => m.date.getTime() === d.getTime())
          ))
          : -1;

        // Only allow selection if it's the next consecutive month
        if (clickedIndex === lastSelectedIndex + 1) {
          return [...prev, monthDate];
        }

        // If no months selected yet, allow selecting the first one
        if (prev.length === 0 && clickedIndex === 0) {
          return [monthDate];
        }

        return prev;
      }
    });
  };

  const selectAllMonths = () => {
    setSelectedMonths(availableMonths.map(m => m.date));
  };

  const clearSelection = () => {
    setSelectedMonths([]);
  };

  const proceedToPayment = () => {
    if (selectedMonths.length === 0) {
      // If no months selected, auto-select the first available month
      if (availableMonths.length > 0) {
        setSelectedMonths([availableMonths[0].date]);
      }
      return;
    }
    setPaymentStep("payment");
  };

  const goBackToMonths = () => {
    setPaymentStep("months");
  };

  const getRequestBody = () => {
  const totalAmount = (feeAmount  + transaction_charge) * selectedMonths.length;

    const paymentRequestBody = {
      amount: totalAmount,
      quantity: selectedMonths.length,
      transaction_charge: transaction_charge,
      channel: [selectedChannel],
      price: feeAmount,
      subcriptionFor:selectedMonths,
      productId: productId
    };
    return paymentRequestBody;

  }

  const { callApi: initializePayment, isLoading: paymentLoading, error, data: paymentResponse } = usePost(
    "POST",
    getRequestBody(),
    `${baseUrL}/initialize-payment`,
    null
  );

  const handlePayment = async ():Promise<any> => {
    if (!selectedChannel) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await initializePayment();
      setApiPaymentResponse(response);

      console.log("Payment initialization response:", response);

      if (response.success) {
        setTimeout(() => {
          onPayment(selectedMonths);
          onClose();
        }, 5000);
      }

      const redirect = response?.data?.data?.authorization_url;

      console.log("redirect ====>", redirect);

      router.push(redirect);
      // setPayStackSuccess(true);

    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = (feeAmount  + transaction_charge) * selectedMonths.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-t-2xl p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {paymentStep === "months" ? "Select Months" : "Choose Payment Method"}
              </h2>
              <p className="text-teal-100 text-sm">
                {paymentStep === "months" ? "Select consecutive months to pay" : "Complete your payment"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {payStackSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{apiPaymentResponse?.message}</h3>
              <p className="text-gray-600">
                You've successfully paid for {selectedMonths.length} month{selectedMonths.length > 1 ? 's' : ''}
              </p>

            </div>
          ) : paymentStep === "months" ? (
            <>
              {/* Last Paid Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Last payment</p>
                      <p className="text-xs text-blue-600">
                        {lastPaidDate.toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-800">Monthly Fee</p>
                    <p className="text-xs text-blue-600">{formatNumberToNaira(feeAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Month Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select consecutive months:
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={selectAllMonths}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Select all
                    </button>
                    <button
                      onClick={clearSelection}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-[200px] overflow-y-auto pr-2">
                  <div className="grid sm:grid-cols-3 grid-cols-2 gap-2">
                    {availableMonths.map((month, index) => {
                      const isSelected = selectedMonths.some(d => d.getTime() === month.date.getTime());

                      // A month is selectable if:
                      // 1. It's the first month and no months are selected yet, OR
                      // 2. It's the very next month after the last selected month
                      // 3. OR it's already selected (so it can be deselected)
                      const lastSelectedIndex = selectedMonths.length > 0
                        ? Math.max(...selectedMonths.map(d =>
                          availableMonths.findIndex(m => m.date.getTime() === d.getTime())
                        ))
                        : -1;

                      const isSelectableForSelection = (selectedMonths.length === 0 && index === 0) ||
                        (index === lastSelectedIndex + 1);

                      // A month is clickable if it's selectable for selection OR it's already selected (for deselection)
                      const isClickable = isSelectableForSelection || isSelected;

                      return (
                        <button
                          key={month.month}
                          onClick={() => isClickable && toggleMonthSelection(month.date)}
                          disabled={!isClickable}
                          className={`
                            h-[50px] w-full p-2 rounded-xl border-2 transition-all duration-200 
                            flex flex-col items-center justify-center group
                            ${isSelected
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : isClickable
                                ? 'border-gray-200 hover:border-teal-300 hover:bg-teal-25 cursor-pointer'
                                : 'border-gray-200 opacity-40 cursor-not-allowed'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                              ? 'bg-teal-500 border-teal-500'
                              : isClickable
                                ? 'border-gray-300 group-hover:border-teal-400'
                                : 'border-gray-300'
                              }`}>
                              {isSelected && (
                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="font-medium text-[10px] leading-tight text-center">
                            {month.month}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selection info */}
                {selectedMonths.length > 0 && (
                  <div className="mt-4 bg-teal-50 border border-teal-200 rounded-xl p-3">
                    <p className="text-sm font-medium text-teal-800 mb-2">
                      Paying for {selectedMonths.length} month{selectedMonths.length > 1 ? 's' : ''}:
                    </p>
                    <div className="text-xs text-teal-700 space-y-1">
                      {selectedMonths.map((month, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help text */}
                {availableMonths.length > 0 && (
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {selectedMonths.length === 0
                      ? "Click the first month to start selection"
                      : "You can only select consecutive months starting from the first unpaid month"
                    }
                  </div>
                )}
              </div>
            </>
          ) : (

            <>
              {apiPaymentResponse && <FeedbackMessage message={apiPaymentResponse.success ? apiPaymentResponse.message : apiPaymentResponse.error} success={apiPaymentResponse.success} />}


              <div className="mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Payment Summary</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatNumberToNaira(totalAmount)}</p>
                    <p className="text-sm text-purple-600 mt-1">
                      for {selectedMonths.length} month{selectedMonths.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Select Payment Method:
                  </label>

                  <div className="space-y-3">
                    {paymentChannels.map((channel) => (
                      <button
                        key={channel.value}
                        onClick={() => setSelectedChannel(channel.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedChannel === channel.value
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300 hover:bg-teal-25'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedChannel === channel.value
                              ? 'bg-teal-500 border-teal-500'
                              : 'border-gray-300'
                              }`}>
                              {selectedChannel === channel.value && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{channel.label}</div>
                              <div className="text-xs text-gray-500">{channel.description}</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </>
          )}
        </div>

        {/* Fixed Bottom Section */}
        {!apiPaymentResponse?.success && (
          <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-white">
            {/* Payment Summary - Only show in months selection step */}
            {paymentStep === "months" && selectedMonths.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-4 border border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Monthly fee:</span>
                  <span className="font-medium">{formatNumberToNaira(feeAmount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Months selected:</span>
                  <span className="font-medium">{selectedMonths.length}</span>
                </div>
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total amount:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatNumberToNaira(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {paymentStep === "payment" ? (
                <>
                  <button
                    onClick={goBackToMonths}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    // onClick={() => { handlePayment();
                    //       setPayStackSuccess(true);
                    //  }}

                    onClick={async () => {
                      const result = await handlePayment();
                      if (result.success) {
                        setPayStackSuccess(true);
                      }
                    }}


                    disabled={isProcessing || !selectedChannel}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${formatNumberToNaira(totalAmount)}`
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border text-[12px] border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={proceedToPayment}
                    disabled={selectedMonths.length === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r text-[12px] from-teal-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    Continue to Payment
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;