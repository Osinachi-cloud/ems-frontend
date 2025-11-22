export const CompactModal: React.FC<{
    onClose: () => void;
    title: string;
    isModalOpen: boolean;
    children: React.ReactNode;
}> = ({ onClose, title, isModalOpen, children }) => {
    if (!isModalOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-sm w-full">
                {children}
            </div>
        </div>
    );
};