import { useEffect, useState } from "react"
import { RootState, useAppSelector } from "@/redux/store";
import { useLocalStorage } from "./useLocalStorage";
import { errorToast, successToast } from "./UseToast";
import { useRouter } from 'next/navigation';



export const usePost = (methodType: string, body: any, url: string, route:string) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

    console.log(methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken;
    const router = useRouter();

    console.log("token ====>", token);


    const callApi = async () => {
        console.log("call Api for me");
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Add Authorization header only if token is provided
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const fetchOptions: RequestInit = {
                method: methodType,
                headers: headers,
            };

            // Add body for non-GET requests
            if (body && methodType !== 'GET') {
                fetchOptions.body = JSON.stringify(body);
            }

            const apiResponse = await fetch(url, fetchOptions);

            if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
            }

            const dataResponse = await apiResponse.json();
            successToast(dataResponse?.message); 
            setData(dataResponse?.message);
            setIsLoading(false);
            console.log(dataResponse);
            if(route === null){
                window.location.reload();
            }else{
                router.push(`/${route}`)

            }

        } catch (e: any) {
            console.log(e.message);
            setIsLoading(false);
            const msg = e?.message || "Error processing request";
            errorToast(msg); 

            setError(msg);
        }
    }

    return { data, isLoading, setIsLoading, callApi, error };
}





// // MOCK: Simplified useFetch Hook for fetching paginated data
// const useFetch = <T,>(method: string, body: any, url: string, currentPage: number) => {
//     const [data, setData] = useState<BaseResponse<ProductsFetchResponse> | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
    
//     // Internal state to trigger re-fetch when page changes or manual refresh
//     const [refetchTrigger, setRefetchTrigger] = useState(0);

//     // REMOVED MOCK_INVENTORY_DATA_FULL
//     const callApi = useCallback(async () => {
//         setIsLoading(true);
//         setError(null);
        
//         try {
//             // --- LIVE API CALL SIMULATION ---
//             console.log(`[API CALL] Fetching products for page ${currentPage} from: ${url}`);
            
//             // NOTE: Replace this mock delay with your actual fetch call
//             await new Promise(resolve => setTimeout(resolve, 500));
            
//             // --- Mock LIVE API Response (Example Structure) ---
//             const total = 12; // Assume 12 total products are on the server
//             const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
//             const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
//             const end = Math.min(currentPage * ITEMS_PER_PAGE, total);
            
//             // Generating mock data that changes per page to simulate API response
//             const paginatedData: Product[] = Array.from({ length: end - start + 1 }, (_, i) => ({
//                 productId: `p-${start + i}`, 
//                 name: `Product ${start + i}`, 
//                 description: `Dynamic product listing for page ${currentPage}.`, 
//                 code: `C${start + i}`, 
//                 price: 100 + (start + i) * 10, 
//                 designation: i % 2 === 0 ? 'TENANT' : 'LANDLORD',
//             }));

//             const mockResponse: BaseResponse<ProductsFetchResponse> = {
//                 success: true,
//                 message: "Products fetched successfully",
//                 data: {
//                     data: paginatedData,
//                     page: totalPages,
//                     total: total,
//                     currentPage: currentPage,
//                     itemsPerPage: ITEMS_PER_PAGE
//                 }
//             };
            
//             setData(mockResponse);
//         } catch (e) {
//             setError("Failed to fetch data from API.");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [url, method, body, currentPage]); // dependency on currentPage ensures auto-refetch on page change

//     useEffect(() => {
//         callApi(); 
//     }, [callApi, refetchTrigger]);
    
//     const refetch = useCallback(() => {
//         setRefetchTrigger(prev => prev + 1);
//     }, []);

//     return { data, isLoading, error, callApi: refetch };
// };

// // MOCK: usePost Hook for Create/Update operations
// const usePost = <T,>(method: string, initialBody: any, url: string) => {
//     const [data, setData] = useState<T | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const callApi = useCallback(async (body: any): Promise<BaseResponse<Product>> => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             // --- LIVE API CALL SIMULATION ---
//             console.log(`[API CALL] POST/PUT request sent to: ${url}`);
            
//             // NOTE: Replace this mock delay with your actual fetch call
//             await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
            
//             // Check if the API call was successful based on status code (mocked success)
//             const success = true; 
            
//             if (success) {
//                 const responseDto: Product = { productId: `prod-${Date.now()}`, ...body };
//                 const mockResponse: BaseResponse<Product> = {
//                     success: true,
//                     message: "Product action successful!",
//                     data: responseDto,
//                 };
//                 setData(mockResponse as unknown as T);
//                 return mockResponse;
//             } else {
//                 const errorResponse: BaseResponse<Product> = {
//                     success: false,
//                     message: "API Error: Product failed to save.",
//                     data: {} as Product,
//                 };
//                 setError(errorResponse.message);
//                 return errorResponse;
//             }
//         } catch (e) {
//             const errorResponse: BaseResponse<Product> = {
//                 success: false,
//                 message: "Network Error: Failed to perform action.",
//                 data: {} as Product,
//             };
//             setError(errorResponse.message);
//             return errorResponse;
//         } finally {
//             setIsLoading(false);
//         }
//     }, [url, method, initialBody]);
    
//     return { data, isLoading, error, callApi };
// };

// --- END MOCK EXTERNAL IMPORTS ---

// --- Dropdown Options ---