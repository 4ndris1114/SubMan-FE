<template>
<div class="min-h-screen bg-gray-50">
        <Navbar />
        <h1 class="text-2xl font-bold text-center mt-30">My Subscriptions</h1>

        <!-- Add Subscription Button -->
        <div class="flex justify-end p-4">
            <button @click="toggleForm" class="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600">
                Add Subscription
            </button>
        </div>

        <!-- Add Subscription Form  -->
        <div v-if="isFormVisible" class="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
            <h2 class="text-lg font-semibold mb-2">Add New Subscription</h2>
            <form @submit.prevent="addNewSubscription()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input v-model="newSubscription!.name" type="text" placeholder="Name" class="border p-2 rounded" required />
                    <input v-model="newSubscription!.description" type="text" placeholder="Description" class="border p-2 rounded" required />
                    <input v-model.number="newSubscription!.price" type="number" placeholder="Price" class="border p-2 rounded" required />
                    <input v-model="newSubscription!.dueDate" type="date" class="border p-2 rounded" required />
                    <input v-model="newSubscription!.currency" type="text" placeholder="Currency" class="border p-2 rounded" />
                </div>
                <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Subscription
                </button>
            </form>
        </div>

        <!-- Subscription Table -->
        <div class="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
            <table class="min-w-full text-sm">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="py-2 px-4 text-left">Subscription</th>
                        <th class="py-2 px-4 text-left">Amount</th>
                        <th class="py-2 px-4 text-left">Due Date</th>
                        <th class="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(subscription, index) in subscriptions" :key="subscription.id">
                        <td class="py-2 px-4">{{ subscription.name }}</td>
                        <td class="py-2 px-4">${{ subscription.price }}</td>
                        <td class="py-2 px-4">{{ subscription.dueDate }}</td>
                        <td class="py-2 px-4">
                            <button @click="toggleDetails(index)" class="text-blue-500 hover:text-blue-700">
                                <fa icon="chevron-down" class="scale-140 text-blue" v-if="!isOpen(index)" />
                                <fa icon="chevron-up" class="scale-140 text-blue-500" v-else />
                            </button>
                        </td>
                        <div v-for="(subscription, index) in subscriptions" :key="'details-' + subscription.id"
                        v-show="isOpen(index)">
                        <td colspan="4" class="py-4 px-4 bg-gray-50">
                            <div class="p-4 border border-gray-200 rounded-lg">
                                <p><strong>Amount to Pay:</strong> ${{ subscription.price }}</p>
                                <p><strong>Due Date:</strong> {{ subscription.dueDate }}</p>
                                <p><strong>Description:</strong> {{ subscription.description }}</p>
                            </div>
                        </td>
                    </div>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import type { ISubscription } from '@/types/interfaces/ISubscription';

const isFormVisible = ref(false); // To track visibility of the form

const store = useSubscriptionStore();
const newSubscription = ref<ISubscription | null>({
    id: '',
  name: '',
  description: '',
  price: 0,
  dueDate: new Date(),
  currency: ''
} as ISubscription);

const subscriptions = ref<ISubscription[]>([
    {
        id: '1',
        name: 'Netflix',
        price: 15.99,
        dueDate: new Date('2025-05-05'),
        description: 'Streaming service for movies and TV shows.',
        currency: 'USD'
    },
    {
        id: '2',
        name: 'Spotify',
        price: 9.99,
        dueDate: new Date('2025-05-05'),
        description: 'Music streaming service with premium features.',
        currency: 'USD'
    },
    {
        id: '3',
        name: 'Amazon Prime',
        price: 12.99,
        dueDate: new Date('2025-05-05'),
        description: 'Amazon’s subscription service for free shipping and streaming.',
        currency: 'USD'
    }
]);

const addNewSubscription = async () => {
    if (!newSubscription.value?.name || !newSubscription.value?.price || !newSubscription.value?.dueDate) return;

    await store.addSubscription(newSubscription.value);

    // Reset the form
    newSubscription.value = {
        id: '',
        name: '',
        description: '',
        price: 0,
        dueDate: new Date(),
        currency: ''
    } as ISubscription;
};
const toggleForm = () => {
    isFormVisible.value = !isFormVisible.value;
}

const openIndexes = ref<number[]>([]);

const toggleDetails = (index: number) => {
    if (openIndexes.value.includes(index)) {
        openIndexes.value = openIndexes.value.filter((i: number) => i !== index);
    } else {
        openIndexes.value.push(index);
    }
};

const isOpen = (index: number) => openIndexes.value.includes(index);

</script>

<style scoped>

</style>