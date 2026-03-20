"use client"

import React, { useState } from 'react';
import { PlusCircle, Loader2, MapPin } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PaginationControls } from '../inventory/pagination';
import { Modal } from '../inventory/modal';
import { baseUrL } from '@/env/URLs';
import { Address } from '@/types/address';
import { AddressStatistics } from './addressStatistics';
import AddressForm from './addressForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ITEMS_PER_PAGE = 100;

const ManageAddressesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { getUserDetails } = useLocalStorage("userDetails", null);
    const estateId = getUserDetails()?.estateId;

    const fetchUrl = `${baseUrL}/get-addresses?estateId=${estateId}&page=${currentPage - 1}&size=${ITEMS_PER_PAGE}`;

    const {
        data: addressesResponse,
        isLoading: addressesLoading,
        error: addressesError,
        callApi: refetchAddresses,
    } = useFetch("GET", null, fetchUrl);

    const paginatedAddresses: Address[] = addressesResponse?.data?.data || [];
    const addressCount: number = addressesResponse?.data?.total || 0;
    const totalPages = Math.ceil(addressCount / ITEMS_PER_PAGE) || 1;

    const handleAddressSuccess = () => {
        refetchAddresses();
        setIsModalOpen(false);
    };

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

            {/* Page Header and Action */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center space-x-3">
                    <MapPin className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Addresses</h1>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Address</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Statistics */}
            <AddressStatistics />

            {/* Loading/Error State */}
            {addressesLoading && (
                <div className="text-center py-10 text-blue-600">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                    <p className="font-semibold">Loading addresses...</p>
                </div>
            )}
            {addressesError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    <p className="font-semibold">Error fetching addresses: {addressesError}</p>
                    <button onClick={() => refetchAddresses()} className="text-sm underline mt-2">Try Again</button>
                </div>
            )}

            {!addressesLoading && !addressesError && (
                <>
                    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden sm:table-header-group">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Full Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Street</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">House No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Apt. No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">City</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">State</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Country</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Postal Code</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedAddresses.map((address: Address, index: number) => (
                                    <tr
                                        key={address.addressId || index}
                                        className="block sm:table-row hover:bg-blue-50 transition duration-150 border-b"
                                    >
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-900 max-w-xs truncate">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Full Address:</span>
                                            {address.fullAddress || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-700">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Street:</span>
                                            {address.street || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-700 font-mono">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">House No.:</span>
                                            {address.houseNumber || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-700">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Apt. No.:</span>
                                            {address.apartmentNumber || (
                                                <span className="text-gray-400 italic text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-700">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">City:</span>
                                            {address.city || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-700">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">State:</span>
                                            {address.state || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-700">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Country:</span>
                                            {address.country || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-500 font-mono">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Postal Code:</span>
                                            {address.postalCode || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                {paginatedAddresses.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
                                            {addressCount === 0
                                                ? 'No addresses found. Click "Add Address" to create one.'
                                                : 'No addresses found on this page.'}
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
                        recordCount={addressCount}
                        totalPages={totalPages}
                        responseLoading={addressesLoading}
                    />
                </>
            )}

            <Modal
                onClose={closeModal}
                title="Add New Address"
                isModalOpen={isModalOpen}
            >
                <AddressForm
                    onSuccess={handleAddressSuccess}
                    onClose={closeModal}
                />
            </Modal>
        </div>
    );
};

export default ManageAddressesPage;
