export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            // day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid Date';
    }
};

export const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0] || "";
    } catch (error) {
        return '';
    }
};




// app/utils/dateUtils.ts
export const getDefaultDateRange = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    
    return {
        fromDate: firstDayOfYear.toISOString().split('T')[0],
        toDate: today.toISOString().split('T')[0]
    };
};

export const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatMonthYear = (monthString: string) => {
    if (!monthString) return 'N/A';
    const [year, month] = monthString?.split('-');
    const date = new Date(parseInt(year || ""), parseInt(month || "") - 1, 1);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
    });
};