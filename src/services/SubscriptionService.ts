import httpClient from "@/services/httpClient";
import type {ISubscription} from "@/types/interfaces/ISubscription";
import {mapToISubscription} from "@/utils/mappers";

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

    async getSubscriptionById(id: number) {
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get<ISubscription>(`/subscriptions/${id}`);
                return response.data;
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
            console.log(subscription);
          const response = await httpClient.post(`/subscription`, subscription);
          console.log(response);
          
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
    }