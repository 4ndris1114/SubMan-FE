import httpClient from "@/services/httpClient";
import type {ISubscription} from "@/types/interfaces/ISubscription";
import {mapToIBook} from "@/utils/mappers";

export class SubscriptionService {
    async getAllSubscriptions(){
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get<ISubscription[]>("/subscriptions");
                return response.data;
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
}