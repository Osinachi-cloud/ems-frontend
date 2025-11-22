export enum TransactionStatus {
    PENDING = 'PROCESSING',
    SUCCESS = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface Transaction {
    reference: string;
    createdAt: string;
    transactionId: string;
    userId: string;
    productName: string;
    status: TransactionStatus;
    subscribeFrom: string;
    subscribeTo: string;
    amount: number;
    transactionCharge: number;
    description: string;
}

export interface TransactionFilters {
    reference?: string;
    status?: TransactionStatus;
    productName?: string;
    fromDate?: string;
    toDate?: string;
    userId?: string;
}