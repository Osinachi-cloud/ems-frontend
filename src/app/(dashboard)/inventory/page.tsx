"use client"

import React, { useState } from 'react';
import { PlusCircle, Loader2, Package, Edit } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PaginationControls } from './pagination';
import { Modal } from './modal';
import { ProductForm } from './productForm';
import { Product } from '@/types/product';
import { baseUrL } from '@/env/URLs';
import { formatNumberToNaira } from '@/app/utils/moneyUtils';

const ITEMS_PER_PAGE = 5;

const InventoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined); 

    const fetchUrl = `${baseUrL}/get-products?page=${currentPage - 1}&size=${ITEMS_PER_PAGE}`;
    
    const {
        data: productsResponse,
        isLoading: productsLoading,
        error: productsError,
        callApi: refetchproducts
    } = useFetch("GET", null, fetchUrl);

    const paginatedProducts = productsResponse?.data?.data || [];
    const productCount = productsResponse?.data?.total || 0;
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE) || 1;

    const handleProductSuccess = () => {
        refetchproducts();
        setEditingProduct(undefined);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(undefined); 
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

            {/* Page Header and Action */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-teal-600" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Product Inventory</h1>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-teal-600 text-white font-bold text-sm rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
                >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Loading/Error State */}
            {productsLoading && (
                <div className="text-center py-10 text-teal-600">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                    <p className="font-semibold">Loading products...</p>
                </div>
            )}
            {productsError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    <p className="font-semibold">Error fetching products: {productsError}</p>
                    <button onClick={() => refetchproducts()} className="text-sm underline mt-2">Try Again</button>
                </div>
            )}

            {!productsLoading && !productsError && (
                <>
                    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden sm:table-header-group">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Transaction Charge</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Publish Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedProducts.map((product: Product) => (
                                    <tr
                                        key={product.productId}
                                        className="block sm:table-row hover:bg-teal-50 transition duration-150 border-b"
                                    >
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell whitespace-normal text-gray-900">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Product Name:</span>
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm text-gray-500 font-mono">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Code:</span>
                                            {product.code || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm font-bold text-green-600">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Price:</span>
                                            {formatNumberToNaira(product.price)}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell text-sm font-bold text-blue-600">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Transaction Charge:</span>
                                            {formatNumberToNaira(product.transactionCharge)}
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Publish Status:</span>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.publishStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.publishStatus ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 block sm:table-cell whitespace-nowrap">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Role:</span>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${product.designation === 'TENANT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {product.designation}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1 sm:py-4 sm:px-6 hidden sm:table-cell text-sm text-gray-600 max-w-xs truncate">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 block">Description:</span>
                                            {product.description || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 sm:py-4 sm:px-6 block sm:table-cell text-right sm:text-right text-sm font-medium">
                                            <span className="sm:hidden text-xs font-semibold text-gray-500 inline-block w-1/4">Actions:</span>
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="text-teal-600 hover:text-teal-900 p-1 rounded-full hover:bg-teal-100 transition"
                                                aria-label={`Edit ${product.name}`}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10 text-gray-500 text-lg block sm:table-cell">
                                            {productCount === 0 ? "No products defined yet. Click \"Add Product\" to begin." : "No products found on this page."}
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
                        recordCount={productCount}
                        totalPages={totalPages}
                        responseLoading={productsLoading}
                    />
                </>
            )}

            <Modal
                onClose={closeModal}
                title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                isModalOpen={isModalOpen}
            >
                <ProductForm
                    onSuccess={handleProductSuccess}
                    onClose={closeModal}
                    initialProduct={editingProduct}
                />
            </Modal>
        </div>
    );
};

export default InventoryPage;