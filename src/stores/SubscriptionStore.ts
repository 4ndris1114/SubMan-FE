import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { ISubscription } from "@/types/interfaces/ISubscription";
import { SubscriptionService } from "@/services/SubscriptionService";

export const useSubscriptionStore = defineStore("subscription", {
    state: () => ({
        subscriptions: [] as ISubscription[],
        // subscriptions: useUserStore().loggedInUser ? useUserStore().loggedInUser!.subscriptions : [] as ISubscription[],
        loading: false,

        selectedSubscription: null as ISubscription | null,
        service: new SubscriptionService() as SubscriptionService,
    }),
    getters:{
        getSubscriptions: (state) => state.subscriptions,
        getSelectedSubscription: (state) => state.selectedSubscription,
        isLoading: (state) => state.loading
    },
        actions: {
    async getAllSubscriptions(userId: string) {
        try {
            this.loading = true;
            this.subscriptions = await this.service.getAllSubscriptions(userId);
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        } finally {
            this.loading = false;
        }
    },
    // async getUpcomingPayments() {
    //     try {
    //         this.loading = true;
    //         // Assuming you're getting all subscriptions and filtering by date
    //         const allSubscriptions = await this.service.getAllSubscriptions();
    //         const upcomingPayments = allSubscriptions.filter((subscription) => {
    //             const currentDate = new Date();
    //             return new Date(subscription.startDate) >= currentDate; // You can change this filter as needed
    //         });
    //         return upcomingPayments;
    //     } catch (error) {
    //         console.error("Error fetching upcoming payments:", error);
    //     } finally {
    //         this.loading = false;
    //     }
    // },

    async getSubscriptionById(id: number) {
        try {
            this.loading = true;
            return await this.service.getSubscriptionById(id);
        } catch (error) {
            console.error("Error fetching subscription:", error);
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async addSubscription(newSubscription : ISubscription) {
        try {
            const createdSubscription = await this.service.addSubscription(newSubscription);
            this.subscriptions.push(createdSubscription);
        } catch (error) {
            console.error('Error adding subscription:', error);
        }
    }
}
});
