"use client";

import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import { Calendar, X, CreditCard, CheckCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeAmount: number;
  lastPaidDate: Date;
  onPayment: (months: Date[]) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  feeAmount, 
  lastPaidDate, 
  onPayment 
}:any) => {
  const [selectedMonths, setSelectedMonths] = useState<Date[]>([]);
  const [availableMonths, setAvailableMonths] = useState<{month: string, date: Date}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
      setPaymentSuccess(false);
    }
  }, [isOpen, lastPaidDate]);

  const toggleMonthSelection = (monthDate: Date) => {
    setSelectedMonths(prev => {
      const isSelected = prev.some(d => d.getTime() === monthDate.getTime());
      
      if (isSelected) {
        // Remove the month if already selected
        return prev.filter(d => d.getTime() !== monthDate.getTime());
      } else {
        // Add the month and ensure consecutive selection
        const newSelection = [...prev, monthDate];
        return sortAndEnsureConsecutive(newSelection, availableMonths);
      }
    });
  };

  const sortAndEnsureConsecutive = (selected: Date[], allMonths: {month: string, date: Date}[]): Date[] => {
    if (selected.length === 0) return [];
    
    // Sort selected dates
    const sorted = selected.sort((a, b) => a.getTime() - b.getTime());
    
    // Get indices of selected months in the available months array
    const indices = sorted.map(date => 
      allMonths.findIndex(m => m.date.getTime() === date.getTime())
    );
    
    // Ensure all indices are consecutive
    const minIndex = Math.min(...indices);
    const maxIndex = Math.max(...indices);
    
    // Fill in any gaps
    const consecutiveSelection = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      consecutiveSelection.push(allMonths[i].date);
    }
    
    return consecutiveSelection;
  };

  const selectAllMonths = () => {
    setSelectedMonths(availableMonths.map(m => m.date));
  };

  const clearSelection = () => {
    setSelectedMonths([]);
  };

  const handlePayment = async () => {
    if (selectedMonths.length === 0) {
      // If no months selected, auto-select the first available month
      if (availableMonths.length > 0) {
        setSelectedMonths([availableMonths[0].date]);
      }
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Call success callback after a delay
    setTimeout(() => {
      onPayment(selectedMonths);
      onClose();
    }, 1500);
  };

  const totalAmount = feeAmount * selectedMonths.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-t-2xl p-6 text-white relative">
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
              <h2 className="text-xl font-bold">Pay Monthly Fee</h2>
              <p className="text-teal-100 text-sm">Select months to pay</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">
                You've successfully paid for {selectedMonths.length} month{selectedMonths.length > 1 ? 's' : ''}
              </p>
            </div>
          ) : (
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
                    Select months to pay:
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
                
                <div className="space-y-2 max-h-60 overflow-y-auto grid grid-cols-3 gap-2">
                  {availableMonths.map((month, index) => {
                    const isSelected = selectedMonths.some(d => d.getTime() === month.date.getTime());
                    const isSelectable = index === 0 || 
                      selectedMonths.some(d => 
                        d.getTime() === availableMonths[index - 1].date.getTime()
                      );

                    return (
                      <button
                        key={month.month}
                        onClick={() => isSelectable && toggleMonthSelection(month.date)}
                        disabled={!isSelectable && selectedMonths.length > 0}
                        className={`col-span-1 h-[50px] w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group 
                          ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-teal-300'
                        } ${
                          !isSelectable && selectedMonths.length > 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-teal-25 cursor-pointer'
                        }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-teal-500 border-teal-500' 
                              : 'border-gray-300 group-hover:border-teal-400'
                          }`}>
                            {isSelected && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-medium text-[12px]">{month.month}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                          isSelected ? 'text-teal-500 rotate-90' : 'group-hover:text-teal-500'
                        }`} />
                      </button>
                    );
                  })}
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
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6 border border-purple-200">
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

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || selectedMonths.length === 0}
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;