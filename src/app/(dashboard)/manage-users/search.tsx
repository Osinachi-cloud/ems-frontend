// import { SearchFilters } from "@/types/reponse";
// import { Search, Filter, X } from "lucide-react";
// import React, { useState } from "react";

// export const initialFilters: SearchFilters = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     roleId: '',
//     isActive: '',
//     designation:''
// };

// export const SearchFilterComponent: React.FC<{
//     filters: SearchFilters;
//     handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//     applySearch: (e: React.FormEvent) => void;
// }> = React.memo(({ filters, handleFilterChange, applySearch }) => {
//     const [isExpanded, setIsExpanded] = useState(false);

//     return (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
//             {/* Compact Header */}
//             <div 
//                 className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsExpanded(!isExpanded)}
//             >
//                 <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-teal-50 rounded-lg">
//                         <Filter className="w-4 h-4 text-teal-600" />
//                     </div>
//                     <div>
//                         <h2 className="text-sm font-semibold text-gray-800">Search Users</h2>
//                         <p className="text-xs text-gray-500">Filter and find specific users</p>
//                     </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-teal-500' : 'bg-gray-300'}`} />
//                     <button
//                         type="button"
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             setIsExpanded(!isExpanded);
//                         }}
//                         className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
//                             <X className="w-4 h-4 text-gray-500" />
//                         </div>
//                     </button>
//                 </div>
//             </div>

//             {isExpanded && (
//                 <form onSubmit={applySearch} className="border-t border-gray-100">
//                     <div className="p-4">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
//                             <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">First Name</label>
//                                 <input
//                                     type="text"
//                                     name="firstName"
//                                     placeholder="Enter first name..."
//                                     value={filters.firstName}
//                                     onChange={handleFilterChange}
//                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                                 />
//                             </div>
                            
//                             <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">Last Name</label>
//                                 <input
//                                     type="text"
//                                     name="lastName"
//                                     placeholder="Enter last name..."
//                                     value={filters.lastName}
//                                     onChange={handleFilterChange}
//                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                                 />
//                             </div>
                            
//                             <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="user@example.com"
//                                     value={filters.email.replace("%40", "")}
//                                     onChange={handleFilterChange}
//                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                                 />
//                             </div>
                            
//                             <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">Status</label>
//                                 <select
//                                     name="isActive"
//                                     value={filters.isActive}
//                                     onChange={handleFilterChange}
//                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none bg-white"
//                                 >
//                                     <option value="">All Status</option>
//                                     <option value="true">Active</option>
//                                     <option value="false">Inactive</option>
//                                 </select>
//                             </div>

//                             <div className="space-y-1">
//                                 <label className="text-xs font-medium text-gray-600">Role ID</label>
//                                 <input
//                                     type="text"
//                                     name="roleId"
//                                     placeholder="Enter role ID..."
//                                     value={filters.roleId}
//                                     onChange={handleFilterChange}
//                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                                 />
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
//                             <button
//                                 type="button"
//                                 onClick={() => setIsExpanded(false)}
//                                 className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//                             >
//                                 <Search className="w-4 h-4" />
//                                 <span>Apply Filters</span>
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// });

// export default SearchFilterComponent