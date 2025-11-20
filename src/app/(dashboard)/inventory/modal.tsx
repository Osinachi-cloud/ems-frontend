import { X } from "lucide-react";
import { useEffect } from "react";

export const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string; isModalOpen:boolean }> = ({ children, onClose, title, isModalOpen }) => {
        const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };

        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }, [onClose]);

        if (!isModalOpen) return null;

        return (
            <div 
                className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative">
                    <div className="p-6 sm:p-8 pb-3 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="p-6 sm:p-8 pt-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };