<template>
    <div class="mt-20">
        <h1 class="text-2xl font-bold">Upcoming Payments:</h1>
        <div v-if="loading" class="text-center text-gray-600">Loading books...</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

        <p>This is a simple test component.</p>
    </div>
</template>
  
  <script setup lang="ts">
import { onMounted, ref } from 'vue';
import {SubscriptionService} from '@/services/SubscriptionService';

interface Subscription {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  }

const loading = ref(true);
const error = ref(null);
const subscriptions = ref<Subscription[]>([]);

const fetchSubscriptions = async () => {
  try {
    const SubscriptionService = new SubscriptionService();
    subscriptions.value = await SubscriptionService.getAllSubscriptions();
}    catch (err: any) {
    error.value = err.message;
} finally {
    loading.value = false;
}
};
onMounted(fetchSubscriptions);
  </script>
  
  <style scoped>
  </style>
  
  
