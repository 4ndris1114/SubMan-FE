import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { ISubscription } from "@/types/interfaces/ISubscription";
import { SubscriptionService } from "@/services/SubscriptionService";

export const useSubscriptionStore = defineStore("subscription", () => {
    const service = new SubscriptionService();
    const subscriptions = ref<ISubscription[]>([]);
    const selectedSubscription = ref<ISubscription | null>(null);
    const loading = ref(false);

    const getAllSubscriptions = computed(() => subscriptions.value);
    const getSelectedSubscription = computed(() => selectedSubscription.value);
    const isLoading = computed(() => loading.value);

    async function fetchAllSubscriptions() {
        try {
            loading.value = true;
            subscriptions.value = await service.getAllSubscriptions();
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        } finally {
            loading.value = false;
        }
    }

    async function getSubscriptionById(id: number) {
        try {
            loading.value = true;
            return await service.getSubscriptionById(id);
        } catch (error) {
            console.error("Error fetching subscription:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        subscriptions,
        selectedSubscription,
        loading,
        getAllSubscriptions,
        getSelectedSubscription,
        isLoading,
        fetchAllSubscriptions,
        getSubscriptionById
    };
});
