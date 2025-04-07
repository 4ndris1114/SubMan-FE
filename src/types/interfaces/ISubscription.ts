export interface ISubscription {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    startDate: Date;
    interval: number;
}