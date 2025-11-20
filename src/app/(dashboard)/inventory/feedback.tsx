import { Response } from "@/types/reponse";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const FeedbackMessage: React.FC<Response> = ({ success, message }) => (
    <div className={`p-4 rounded-lg flex items-center space-x-3 ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md mb-4`}>
        {success ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        <p className="font-medium text-sm">{message}</p>
    </div>
);