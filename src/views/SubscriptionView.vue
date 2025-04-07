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
  
      <!-- Add Subscription Form -->
      <div v-if="isFormVisible" class="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
        <h2 class="text-lg font-bold mb-2">Add New Subscription</h2>
        <form @submit.prevent="addNewSubscription()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="newSubscription!.name" type="text" placeholder="Name" class="border p-2 rounded" required />
            <input v-model="newSubscription!.description" type="text" placeholder="Description" class="border p-2 rounded" required />
            <input v-model.number="newSubscription!.price" type="number" placeholder="Price" class="border p-2 rounded" required />
            
            <!-- Use formattedStartDate for v-model binding -->
            <input v-model="formattedStartDate" type="date" class="border p-2 rounded" required />
            
            <input v-model="newSubscription!.interval" type="number" placeholder="Interval (months)" class="border p-2 rounded" required />
            <input v-model="newSubscription!.currency" type="text" placeholder="Currency" class="border p-2 rounded" />
          </div>
          <button type="submit" class="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-500">
            Add Subscription
          </button>
        </form>
      </div>
  
      <!-- Subscription Table -->
      <div class="max-w-4xl mt-10 mx-auto bg-white shadow rounded-lg">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 text-left text-xl">Subscription</th>
              <th class="py-2 px-4 text-left text-xl">Amount</th>
              <th class="py-2 px-4 text-left text-xl">Start Date</th>
              <th class="py-2 px-4 text-left text-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subscription, index) in subscriptions" :key="subscription.id">
              <td class="py-2 px-4 font-semibold">{{ subscription.name }}</td>
              <td class="py-2 px-4">${{ subscription.price }}</td>
              <td class="py-2 px-4">{{ formatDate(subscription.startDate) }}</td>
              <td class="py-2 px-4">
                <button @click="toggleDetails(index)" class="text-purple-700 hover:text-purple-500">
                  <fa icon="sort-down" class="scale-140 text-purple" v-if="!isOpen(index)" />
                  <fa icon="sort-up" class="scale-140 text-purple-500" v-else />
                </button>
              </td>
              <div v-for="(subscription, index) in subscriptions" :key="'details-' + subscription.id" v-show="isOpen(index)">
                <td colspan="4" class="py-4 px-4 bg-gray-50">
                  <div class="p-4 border border-gray-200 rounded-lg">
                    <p><strong>Amount to Pay:</strong> ${{ subscription.price }}</p>
                    <p><strong>Start Date:</strong> {{ formatDate(subscription.startDate) }}</p>
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
  import { ref, computed } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import { useSubscriptionStore } from '@/stores/subscriptionStore';
  import type { ISubscription } from '@/types/interfaces/ISubscription';
  
  const isFormVisible = ref(false); // To track visibility of the form
  
  const store = useSubscriptionStore();
  const newSubscription = ref<ISubscription | null>({
    id: '',
    userId: '', // You can set userId dynamically
    name: '',
    description: '',
    price: 0,
    startDate: new Date(),
    interval: 1, // Default to 1 month
    currency: ''
  } as ISubscription);
  
  const subscriptions = ref<ISubscription[]>([
    {
      id: '1',
      userId: 'user1',
      name: 'Netflix',
      price: 15.99,
      startDate: new Date('2025-05-05'),
      interval: 1,
      description: 'Streaming service for movies and TV shows.',
      currency: 'USD'
    },
    {
      id: '2',
      userId: 'user1',
      name: 'Spotify',
      price: 9.99,
      startDate: new Date('2025-05-05'),
      interval: 1,
      description: 'Music streaming service with premium features.',
      currency: 'USD'
    },
    {
      id: '3',
      userId: 'user1',
      name: 'Amazon Prime',
      price: 12.99,
      startDate: new Date('2025-05-05'),
      interval: 1,
      description: 'Amazon’s subscription service for free shipping and streaming.',
      currency: 'USD'
    }
  ]);
  
  const addNewSubscription = async () => {
    if (!newSubscription.value?.name || !newSubscription.value?.price || !newSubscription.value?.startDate) return;
  
    await store.addSubscription(newSubscription.value);
  
    // Reset the form
    newSubscription.value = {
      id: '',
      userId: '', // Set dynamic userId if needed
      name: '',
      description: '',
      price: 0,
      startDate: new Date(),
      interval: 1,
      currency: ''
    } as ISubscription;
  };
  
  const toggleForm = () => {
    isFormVisible.value = !isFormVisible.value;
  };
  
  const openIndexes = ref<number[]>([]);
  
  const toggleDetails = (index: number) => {
    if (openIndexes.value.includes(index)) {
      openIndexes.value = openIndexes.value.filter((i: number) => i !== index);
    } else {
      openIndexes.value.push(index);
    }
  };
  
  const isOpen = (index: number) => openIndexes.value.includes(index);
  
  // Computed property to format the startDate correctly for input type="date"
  const formattedStartDate = computed({
    get: () => {
      if (newSubscription.value?.startDate instanceof Date) {
        const year = newSubscription.value.startDate.getFullYear();
        const month = String(newSubscription.value.startDate.getMonth() + 1).padStart(2, '0'); // Adding leading zero
        const day = String(newSubscription.value.startDate.getDate()).padStart(2, '0'); // Adding leading zero
        return `${year}-${month}-${day}`; // Return the date in "yyyy-MM-dd" format
      }
      return '';
    },
    set: (value: string) => {
      const [year, month, day] = value.split('-');
      newSubscription.value!.startDate = new Date(Number(year), Number(month) - 1, Number(day)); // Convert back to Date object
    }
  });
  
  // Utility function to format the date for display
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  </script>
  
  <style scoped>
  </style>
  