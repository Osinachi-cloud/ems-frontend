"use client";

import { baseUrL } from '@/env/URLs';
import { useFetch } from '@/hooks/useFetch';
import React from 'react';

interface AddressStatisticsProps {
    onStatClick?: (filterType: string, filterValue: any) => void;
}

interface AddressStatisticsData {
    totalAddressCount: number;
    uniqueStreetCount: number;
    uniqueCityCount: number;
    uniqueStateCount: number;
    withApartmentCount: number;
    withoutApartmentCount: number;
}

export function AddressStatistics({ onStatClick }: AddressStatisticsProps) {

    const fetchUrl = `${baseUrL}/get-address-stats`;

    const {
        data: statsResponse,
        isLoading: statsLoading,
    } = useFetch("GET", null, fetchUrl);

    const stats: AddressStatisticsData = statsResponse?.data;

    return (
        <>
            {/* Address Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3 mb-6">

                {/* Total Addresses */}
                <div
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('all', null)}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-blue-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Total Addresses</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{statsLoading ? '...' : (stats?.totalAddressCount ?? '—')}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-blue-200 text-[9px] md:text-xs flex items-center">All addresses</div>
                    </div>
                </div>

                {/* Unique Streets */}
                <div
                    className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('street', null)}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-green-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Streets</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{statsLoading ? '...' : (stats?.uniqueStreetCount ?? '—')}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-green-200 text-[9px] md:text-xs flex items-center">Unique streets</div>
                    </div>
                </div>

                {/* Unique Cities */}
                <div
                    className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-amber-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Cities</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{statsLoading ? '...' : (stats?.uniqueCityCount ?? '—')}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-amber-200 text-[9px] md:text-xs flex items-center">Unique cities</div>
                    </div>
                </div>

                {/* Unique States */}
                <div
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-purple-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">States</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{statsLoading ? '...' : (stats?.uniqueStateCount ?? '—')}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 7l2.55 2.4A1 1 0 0116 11H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-purple-200 text-[9px] md:text-xs flex items-center">Unique states</div>
                    </div>
                </div>

                {/* Apartments */}
                <div
                    className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-cyan-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Apartments</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{statsLoading ? '...' : (stats?.withApartmentCount ?? '—')}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                <path d="M2 12a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-cyan-200 text-[9px] md:text-xs flex items-center">With apartment no.</div>
                    </div>
                </div>

                {/* Houses */}
                <div
                    className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-rose-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Houses</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{statsLoading ? '...' : (stats?.withoutApartmentCount ?? '—')}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-rose-200 text-[9px] md:text-xs flex items-center">Without apartment no.</div>
                    </div>
                </div>

            </div>
        </>
    );
}
