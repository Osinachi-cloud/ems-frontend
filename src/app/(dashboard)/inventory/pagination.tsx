import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
    recordCount: number;
    totalPages: number;
    responseLoading: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, setCurrentPage, itemsPerPage, recordCount, totalPages, responseLoading }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, recordCount);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    if (responseLoading || recordCount === 0) return null;
    if (recordCount <= itemsPerPage && totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white rounded-xl shadow-md border-t border-gray-100">
            <p className="text-sm text-gray-700 mb-3 sm:mb-0">
                Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{recordCount}</span> products
            </p>

            <div className="flex space-x-1">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-1 mx-2">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => goToPage(index + 1)}
                            className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === index + 1
                                ? 'bg-teal-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};