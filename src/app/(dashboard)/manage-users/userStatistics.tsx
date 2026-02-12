// "use client";

// import { baseUrL } from '@/env/URLs';
// import { useFetch } from '@/hooks/useFetch';
// import { UserStatistics } from '@/types/user';
// import React from 'react';

// export function UserStatistics() {

//     const fetchUrl = `${baseUrL}/get-users-stats?`;

//     const {
//         data: usersStatResponse,
//         isLoading: usersStatLoading,
//         error: usersStatError,
//         callApi: refetchUsersStat
//     } = useFetch("GET", null, fetchUrl);

//     const userStatistics: UserStatistics = usersStatResponse?.data;

//     return (
//         <>

//             {/* User Statistics Cards - Compact Version */}
//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3 mb-6">

//                 {/* Total Users */}
//                 <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-blue-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Total Users</div>
//                             <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.totalUsersCount}</div>
//                         </div>
//                         <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//                             </svg>
//                         </div>
//                     </div>
//                     <div className="mt-1.5 md:mt-2">
//                         <div className="text-blue-200 text-[9px] md:text-xs flex items-center">
//                             <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                             </svg>
//                             All users
//                         </div>
//                     </div>
//                 </div>

//                 {/* Active Users */}
//                 <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-green-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Active</div>
//                             <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.activeUsersCount}</div>
//                         </div>
//                         <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                     </div>
//                     <div className="mt-1.5 md:mt-2">
//                         <div className="text-green-200 text-[9px] md:text-xs flex items-center">
//                             <div className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1 animate-pulse"></div>
//                             Active now
//                         </div>
//                     </div>
//                 </div>

//                 {/* Inactive Users */}
//                 <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-gray-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Inactive</div>
//                             <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.inactiveUsersCount}</div>
//                         </div>
//                         <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                     </div>
//                     <div className="mt-1.5 md:mt-2">
//                         <div className="text-gray-200 text-[9px] md:text-xs flex items-center">
//                             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-1"></div>
//                             Not active
//                         </div>
//                     </div>
//                 </div>

//                 {/* Landlords */}
//                 <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-amber-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Landlords</div>
//                             <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.landLordUsersCount}</div>
//                         </div>
//                         <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                             </svg>
//                         </div>
//                     </div>
//                     <div className="mt-1.5 md:mt-2">
//                         <div className="text-amber-200 text-[9px] md:text-xs flex items-center">
//                             <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                             </svg>
//                             Owners
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tenants */}
//                 <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-purple-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Tenants</div>
//                             <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.tenantUsersCount}</div>
//                         </div>
//                         <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
//                             </svg>
//                         </div>
//                     </div>
//                     <div className="mt-1.5 md:mt-2">
//                         <div className="text-purple-200 text-[9px] md:text-xs flex items-center">
//                             <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                             </svg>
//                             Renters
//                         </div>
//                     </div>
//                 </div>

//                 {/* Occupants */}
//                 <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <div className="text-cyan-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Occupants</div>
//                             <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.occupantUsersCount}</div>
//                         </div>
//                         <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
//                             <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                             </svg>
//                         </div>
//                     </div>
//                     <div className="mt-1.5 md:mt-2">
//                         <div className="text-cyan-200 text-[9px] md:text-xs flex items-center">
//                             <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
//                             </svg>
//                             Residents
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     );
// }








"use client";

import { baseUrL } from '@/env/URLs';
import { useFetch } from '@/hooks/useFetch';
import { UserStatistics } from '@/types/user';
import React from 'react';

interface UserStatisticsProps {
  onStatClick?: (filterType: string, filterValue: any) => void;
}

export function UserStatistics({ onStatClick }: UserStatisticsProps) {

    const fetchUrl = `${baseUrL}/get-users-stats?`;

    const {
        data: usersStatResponse,
        isLoading: usersStatLoading,
        error: usersStatError,
        callApi: refetchUsersStat
    } = useFetch("GET", null, fetchUrl);

    const userStatistics: UserStatistics = usersStatResponse?.data;

    return (
        <>

            {/* User Statistics Cards - Compact Version */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-3 mb-6">

                {/* Total Users */}
                <div 
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('all', null)}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-blue-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Total Users</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.totalUsersCount}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-blue-200 text-[9px] md:text-xs flex items-center">
                            <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            All users
                        </div>
                    </div>
                </div>

                {/* Active Users */}
                <div 
                    className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('isActive', 'true')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-green-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Active</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.activeUsersCount}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-green-200 text-[9px] md:text-xs flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1 animate-pulse"></div>
                            Active now
                        </div>
                    </div>
                </div>

                {/* Inactive Users */}
                <div 
                    className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('isActive', 'false')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Inactive</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.inactiveUsersCount}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-gray-200 text-[9px] md:text-xs flex items-center">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-1"></div>
                            Not active
                        </div>
                    </div>
                </div>

                {/* Landlords */}
                <div 
                    className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('designation', 'LANDLORD')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-amber-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Landlords</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.landLordUsersCount}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-amber-200 text-[9px] md:text-xs flex items-center">
                            <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                            Owners
                        </div>
                    </div>
                </div>

                {/* Tenants */}
                <div 
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('designation', 'TENANT')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-purple-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Tenants</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.tenantUsersCount}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-purple-200 text-[9px] md:text-xs flex items-center">
                            <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Renters
                        </div>
                    </div>
                </div>

                {/* Occupants */}
                <div 
                    className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-2 md:p-3 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => onStatClick && onStatClick('designation', 'OCCUPANT')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-cyan-100 text-[10px] md:text-xs font-medium uppercase tracking-wide">Occupants</div>
                            <div className="text-lg md:text-xl font-bold mt-0.5">{userStatistics?.occupantUsersCount}</div>
                        </div>
                        <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-1.5 md:mt-2">
                        <div className="text-cyan-200 text-[9px] md:text-xs flex items-center">
                            <svg className="w-2 h-2 md:w-3 md:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                            </svg>
                            Residents
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}