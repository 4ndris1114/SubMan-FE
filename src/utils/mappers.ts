import type { IUser } from "@/types/interfaces/IUser";
import type { ISubscription } from "@/types/interfaces/ISubscription";

export const mapToIUser = (user: any): IUser => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: new Date(user.createdAt), // Ensuring it's a Date object
    };
};

export const mapToISubscription = (subscription: any): ISubscription => {
    return {
        id: subscription.id,
        userId: subscription.userId,
        name: subscription.name,
        description: subscription.description,
        price: subscription.price,
        currency: subscription.currency,
        startDate: new Date(subscription.startDate),
        interval: subscription.interval
    };
};
