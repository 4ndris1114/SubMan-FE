export interface ISubscription {
    id: string;
    name: string;
    description: string;
    price: number;
    dueDate: Date;
    currency: string;
}