import httpClient from "@/services/httpClient";
import type { ISubscription } from "@/types/interfaces/ISubscription";
import { mapToISubscription } from "@/utils/mappers";

export class SubscriptionService {
    async getAllSubscriptions(userId: string) {
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get<ISubscription[]>(`/subscription/user/${userId}`);
                return response.data.map((subscription: ISubscription) => mapToISubscription(subscription));

            } catch (error: any) {
                console.error("Error fetching subscriptions:", error);
                attempts++;
                if (attempts === maxAttempts) {
                    throw new Error("Failed to fetch subscriptions after multiple attempts");
                }
            }
        }
        return [];
    }

    async getSubscriptionById(id: number) {
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get(`/subscription/${id}`);
                return mapToISubscription(response.data);
            } catch (error: any) {
                console.error("Error fetching subscription:", error);
                attempts++;
                if (attempts === maxAttempts) {
                    throw new Error("Failed to fetch subscription after multiple attempts");
                }
            }
        }
        return null;
    }

    async addSubscription(subscription: ISubscription) {
        try {
            const response = await httpClient.post(`/subscription`, subscription);

            if (response.status === 201) {
                return mapToISubscription(response.data); // Assuming you want to map it to ISubscription
            } else {
                throw new Error('Failed to create subscription');
            }
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    async updateSubscription(subscription: ISubscription) {
        try {
            const response = await httpClient.put(`/subscription/${subscription.id}`, subscription);

            if (response.status === 200) {
                return mapToISubscription(response.data);
            } else {
                throw new Error('Failed to update subscription');
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
    }

    async deleteSubscription(subscriptionId: string) {
        try {
            const response = await httpClient.delete(`/subscription/${subscriptionId}`);

            if (response.status === 204) {
                return true; // Successfully deleted
            } else {
                throw new Error('Failed to delete subscription');
            }
        } catch (error) {
            console.error('Error deleting subscription:', error);
            throw error;
        }
    }
}