// components/Orders.tsx
'use client';

import { useState, useEffect } from 'react';
import { mockOrderService } from './mockData';
import { Order, ProductOrderStatistics, ProductOrderRequest, Status, OrderStatus } from '@/types/order';
// import { mockOrderService } from '@/services/mockData';

const Orders = () => {
  const [customersOrder, setCustomersOrder] = useState<Order[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [numOfPages, setNumOfPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [productOrderRequest, setProductOrderRequest] = useState<ProductOrderRequest>({
    productId: null,
    customerId: "user123", // Mock customer ID
    status: null,
    orderId: null,
    productCategory: null,
    vendorId: null,
    page: 0,
    size: 12
  });

  const [productOrderStatistics, setProductOrderStatistics] = useState<ProductOrderStatistics>({
    allOrdersCount: 0,
    processingOrdersCount: 0,
    cancelledOrdersCount: 0,
    failedOrdersCount: 0,
    completedOrdersCount: 0,
    inTransitOrdersCount: 0,
    paymentCompletedCount: 0
  });

  useEffect(() => {
    getOrderStats();
    getCustomerOrders();
  }, []);

  const getNumberOfPages = (total: number): void => {
    if (total % productOrderRequest.size === 0) {
      setNumOfPages(total / productOrderRequest.size);
    } else {
      setNumOfPages(1 + Math.floor(total / productOrderRequest.size));
    }
  };

  const filterByStatus = (status: OrderStatus | null) => {
    setProductOrderRequest(prev => ({
      ...prev,
      status,
      orderId: null,
      page: 0
    }));
    getCustomerOrders({ ...productOrderRequest, status, orderId: null, page: 0 });
  };

  const getOrderStats = async (): Promise<void> => {
    try {
      const response = await mockOrderService.getOrderStats();
      setProductOrderStatistics(response.data.getProductOrderStatsByCustomer);
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomerOrders = async (request?: ProductOrderRequest): Promise<void> => {
    setIsLoading(false);
    try {
      const req = request || productOrderRequest;
      const response = await mockOrderService.getCustomerOrders(req);
      setCustomersOrder(response.data.fetchCustomerOrdersBy.data);
      setOrderTotal(response.data.fetchCustomerOrdersBy.total);
      getNumberOfPages(response.data.fetchCustomerOrdersBy.total);
      setIsLoading(true);
    } catch (error) {
      setIsLoading(true);
      console.log(error);
    }
  };

  const nextPage = (): void => {
    if (productOrderRequest.page + 1 < numOfPages) {
      const newPage = productOrderRequest.page + 1;
      setProductOrderRequest(prev => ({ ...prev, page: newPage }));
      getCustomerOrders({ ...productOrderRequest, page: newPage });
    }
  };

  const previousPage = (): void => {
    if (productOrderRequest.page > 0) {
      const newPage = productOrderRequest.page - 1;
      setProductOrderRequest(prev => ({ ...prev, page: newPage }));
      getCustomerOrders({ ...productOrderRequest, page: newPage });
    }
  };

  const getSize = (size: number): void => {
    setProductOrderRequest(prev => ({ ...prev, size, page: 0 }));
    getCustomerOrders({ ...productOrderRequest, size, page: 0 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductOrderRequest(prev => ({ ...prev, orderId: value }));
  };

  const handleSearchSubmit = () => {
    getCustomerOrders();
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
      PROCESSING: { bg: 'bg-[lightgrey]', text: 'text-[#fff]', label: 'PROCESSING' },
      ACTIVE: { bg: 'bg-[#e9dffc]', text: 'text-[#7b57fc]', label: 'ACTIVE' },
      FAILED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'FAILED' },
      IN_TRANSIT: { bg: 'bg-[#E4E7FD]', text: 'text-[#5570F1]', label: 'IN TRANSIT' },
      COMPLETED: { bg: 'bg-[#DEEEE7]', text: 'text-[#32936F]', label: 'COMPLETED' },
      PAYMENT_COMPLETED: { bg: 'bg-[#fef2dc]', text: 'text-[orange]', label: 'PAID' },
      VENDOR_PROCESSING_START: { bg: 'bg-[#d9fcd1]', text: 'text-[#30a532]', label: 'STARTED' },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-[#d4e1f9]', text: 'text-[#387dfd]', label: 'COMPLETED' },
      REJECTED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'REJECTED' }
    };

    const config = statusConfig[status] || statusConfig.PROCESSING;

    return (
      <div className={`${config.bg} py-2 flex items-center justify-center gap-4 rounded`}>
        <span className={config.text}>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#F5F4F7] h-fit md:p-4 p-2">
      <div className="flex justify-between items-center mb-20">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-[#15192C] font-semibold text-2xl leading-8">Transaction Summary</h2>
          </div>
          <div className="flex justify-center gap-2 items-center bg-white p-4 rounded-xl cursor-pointer">
            <div className="flex justify-center h-5">
              {/* Replace with your download icon */}
              <span className="text-[#7B57FC] text-lg">↓</span>
            </div>
            <span className="text-[#7B57FC]">Export</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        {/* All Orders */}
        <div
          onClick={() => filterByStatus(Status.all)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 gap-8 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-base leading-6">All Transactions</div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-medium leading-8">{productOrderStatistics.allOrdersCount}</span>
            </div>
          </div>
          <div>
            <div className="bg-black w-12 h-12 flex justify-center items-center rounded-full">
              <span className="text-white text-lg">🛒</span>
            </div>
          </div>
        </div>
        {/* Paid */}
        <div
          onClick={() => filterByStatus(Status.paid)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 gap-8 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-base leading-6">Paid</div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-medium leading-8">{productOrderStatistics.paymentCompletedCount}</span>
            </div>
          </div>
          {/* <div>
            <div className="bg-gray-500 w-12 h-12 flex justify-center items-center rounded-full">
              <span className="text-white text-lg">⏰</span>
            </div>
          </div> */}

          <div>
            <div className="bg-[#519C66] w-12 h-12 flex justify-center items-center rounded-full">
              <span className="text-white text-lg">✓</span>
            </div>
          </div>

        </div>

        {/* Cancelled */}
        <div
          onClick={() => filterByStatus(Status.rejected)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 gap-8 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-base leading-6">Cancelled</div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-medium leading-8">{productOrderStatistics.cancelledOrdersCount}</span>
            </div>
          </div>
          <div>
            <div className="bg-[#CC5F5F] w-12 h-12 flex justify-center items-center rounded-full">
              <span className="text-white text-lg">✕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl mt-8">
        <div className="flex items-center justify-between p-2 pt-2">
          <div className="w-full grid gap-8">
            <div className="flex justify-between py-4">
              <div className="flex justify-center gap-2 items-center bg-white p-4 rounded-xl">
                <span>My Transactions</span>
              </div>
              <div className="flex justify-end items-center gap-4 w-2/5">
                <div className="bg-[#FBFBFB] border rounded-xl gap-4 flex p-4 py-2 w-3/4 md:mt-0 mt-4">
                  <div className="flex justify-center items-center cursor-pointer" onClick={handleSearchSubmit}>
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    value={productOrderRequest.orderId || ''}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    type="text"
                    className="block p-0 w-full bg-[#FBFBFB] text-gray-900 outline-none rounded-lg"
                    placeholder="Search by amount, payment method..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto sm:rounded-lg border-t">
          {isLoading ? (
            <table className="w-full text-sm text-[#4B5563] text-left">
              <thead className="text-sm italic font-thin text-[#374151] uppercase bg-white">
                <tr className="border-b">
                  <th scope="col" className="p-8">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">Payment ID</label>
                    </div>
                  </th>
                  <th scope="col" className="p-4">Product Name</th>
                  <th scope="col" className="p-4">Order Date</th>
                  <th scope="col" className="p-4">Tracking Id</th>
                  <th scope="col" className="p-4">Order Total</th>
                  <th scope="col" className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {customersOrder.map((order, index) => (
                  <tr key={index} className="text-[#6E7079] bg-white border-b hover:bg-gray-50">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-${order.orderId}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`checkbox-${order.orderId}`} className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <td scope="row" className="px-8 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex gap-4">
                        <div className="p-0">
                          <span className="text-gray-500 leading-0">{order.orderId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8">
                      <div className="flex items-center gap-4">
                        <div>{order.dateCreated}</div>
                      </div>
                    </td>
                    <td className="px-8">{order.orderId}</td>
                    <td className="px-8">
                      {order.currency}
                      {order.amount.toLocaleString()}
                    </td>
                    <td className="px-2">
                      <div className='text-[12px]'>
                        {getStatusBadge(order.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">Loading...</div>
          )}

          {/* Pagination */}
          <div className="mt-2 bg-white flex p-4 justify-end">
            <div className="flex items-center gap-8">
              <div className="p-4 py-2 flex items-center bg-white rounded-xl">
                <span className="whitespace-nowrap">Rows per page: </span>
                <select
                  value={productOrderRequest.size}
                  onChange={(e) => getSize(Number(e.target.value))}
                  className="outline-none text-[#4B5563] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>
              <div>
                {productOrderRequest.page + 1} - {numOfPages} of {orderTotal}
              </div>
              <div className="flex justify-end gap-8 md:mr-8">
                <div
                  className="p-4 py-2 rounded cursor-pointer"
                  onClick={previousPage}
                >
                  <span>←</span>
                </div>
                <div
                  className="p-4 py-2 rounded cursor-pointer"
                  onClick={nextPage}
                >
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;