
import { X } from "lucide-react";
import { useEffect } from "react";

export const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string; isModalOpen:boolean; size?:string }> = ({ children, onClose, title, isModalOpen }) => {
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
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative">
                    {/* Compact header */}
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    {/* Compact content area */}
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };