<template>
  <Navbar />
  <div class="min-h-screen bg-gray-50 mt-16" :class="[isFormVisible ? 'pt-8' : '', showDeleteModal ? 'blur-xs' : '']">

    <!-- Add Subscription Form -->
    <div v-if="isFormVisible" class="max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
      <h2 class="text-lg font-bold mb-2">Add subscription</h2>

      <form @submit.prevent="addNewSubscription()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <p class="text-sm font-bold mb-2">Name</p>
            <input v-model="newSubscription!.name" type="text" placeholder="Name" class="border p-2 rounded w-full"
              required />
          </div>

          <div>
            <p class="text-sm font-bold mb-2">Description</p>
            <input v-model="newSubscription!.description" type="text" placeholder="Description"
              class="border p-2 rounded w-full" required />
          </div>

          <div>
            <p class="text-sm font-bold mb-2">Price</p>
            <input v-model.number="newSubscription!.price" type="number" step="0.01" placeholder="Price"
              class="border p-2 rounded w-full" required />
          </div>

          <div>
            <p class="text-sm font-bold mb-2">Currency</p>
            <select v-model="newSubscription!.currency" class="border p-2 rounded w-full" required>
              <option value="EUR">EUR €</option>
              <option value="DKK">DKK</option>
              <option value="USD">USD $</option>
              <option value="HUF">FT</option>
            </select>
          </div>

          <div>
            <p class="text-sm font-bold mb-2">Start Date</p>
            <input v-model="formattedStartDate" type="date" class="border p-2 rounded w-full" required />
          </div>

          <div>
            <p class="text-sm font-bold mb-2">Interval (Days)</p>
            <input v-model="newSubscription!.interval" type="number" placeholder="Interval (Days)"
              class="border p-2 rounded w-full" required />
          </div>

        </div>

        <div class="flex justify-end">
          <button type="submit" class="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-500 cursor-pointer">
            {{ newSubscription!.id ? 'Save Changes' : 'Add Subscription' }}
          </button>

          <button @click="toggleForm" type="button"
            class="mt-4 ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer">
            Cancel
          </button>
        </div>

      </form>
    </div>

    <!-- Subscription Table -->
    <div class="max-w-4xl mx-auto rounded-lg">
      <div class="flex flex-row justify-between" :class="isFormVisible ? 'pt-8' : 'pt-32'">
        <h1 class="text-3xl font-bold text-start">My Subscriptions</h1>

              <!-- Add Subscription Button -->
        <div class="flex justify-end pb-4">
          <button @click="toggleForm" class="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600 cursor-pointer">
            <fa icon="plus" class="mr-2" />
            Add Subscription
          </button>
        </div>
      </div>
      <table class="min-w-full table-fixed text-sm">
        <thead>
          <tr class="bg-purple-500 text-white text-center">
            <th class="w-1/4 py-2 px-4 text-left text-xl">Subscription</th>
            <th class="w-1/4 py-2 px-4 text-left text-xl">Amount</th>
            <th class="w-1/4 py-2 px-4 text-left text-xl">Due Date</th>
            <th class="w-1/4 py-2 px-4 text-left text-xl">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="subscriptions.length === 0" class="text-center">
            <td colspan="4" class="py-4 px-4 text-gray-500">No subscriptions found.</td>
          </tr>
          <template v-else v-for="(subscription, index) in subscriptions" :key="subscription.id">
            <tr @click="toggleDetails(subscription)" class="group hover:bg-purple-100 bg-purple-50 transition-colors duration-200 cursor-pointer">
              <td class="py-2 px-4 font-semibold">{{ subscription.name }}</td>
              <td class="py-2 px-4">${{ subscription.price }}</td>
              <td class="py-2 px-4">
                {{ formatDate(getNextPaymentDate(subscription.startDate, subscription.interval)) }}
              </td>

              <td class="py-2 px-4">
                <button @click="editSubscription(subscription)" class="text-purple-700 hover:text-purple-500 cursor-pointer">
                  <fa icon="edit" class="scale-140 text-purple" />
                </button>
                <button @click="deleteSubscription(subscription)" class="ml-8 text-red-700 hover:text-red-500 cursor-pointer">
                  <fa icon="trash" class="scale-140 text-red" />
                </button>
                <button class="ml-10 text-purple-700 hover:text-purple-500 cursor-pointer">
                  <fa v-if="selectedSubscription !== subscription" icon="chevron-down" class="scale-140 text-purple" />
                  <fa v-else icon="chevron-up" class="scale-140 text-purple-500" />
                </button>
              </td>
            </tr>

            <tr v-if="selectedSubscription === subscription">
              <td :colspan="4" class="py-4 px-4">
                <div class="">
                  <div class="w-full">
                    <p><strong>Amount to Pay:</strong> ${{ subscription.price }}</p>
                    <p><strong>Start Date:</strong> {{ formatDate(subscription.startDate) }}</p>
                    <p><strong>Description:</strong> {{ subscription.description }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <div class="">
            </div>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <DeleteSubscriptionModal v-if="showDeleteModal" @confirm="confirmDelete" @cancel="showDeleteModal = false" />

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { useSubscriptionStore } from '@/stores/SubscriptionStore';
import type { ISubscription } from '@/types/interfaces/ISubscription';
import { useUserStore } from '@/stores/userStore';
import DeleteSubscriptionModal from '@/components/DeleteSubscriptionModal.vue';

const isFormVisible = ref(false); // To track visibility of the form
const selectedSubscription = ref<ISubscription | null>()
const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const newSubscription = ref<ISubscription | null>({
  id: '',
  userId: '', // You can set userId dynamically
  name: '',
  description: '',
  price: 0,
  startDate: new Date(),
  interval: 30, // Default to 1 month
  currency: 'EUR'
} as ISubscription);

const subscriptions = computed(() => {
  return subscriptionStore.subscriptions.sort((a, b) => {
    const nextPaymentDateA = getNextPaymentDate(a.startDate, a.interval);
    const nextPaymentDateB = getNextPaymentDate(b.startDate, b.interval);
    return nextPaymentDateA.getTime() - nextPaymentDateB.getTime();
  });
});


const showDeleteModal = ref(false)
const subscriptionToDelete = ref<ISubscription | null>(null)

const deleteSubscription = (subscription: ISubscription) => {
  subscriptionToDelete.value = subscription
  showDeleteModal.value = true
}

const editSubscription = (subscription: ISubscription) => {
  newSubscription.value = { ...subscription };
  isFormVisible.value = true;
}

const confirmDelete = async () => {
  if (subscriptionToDelete.value) {
    await subscriptionStore.deleteSubscription(subscriptionToDelete.value)
  }
  showDeleteModal.value = false
  subscriptionToDelete.value = null
}


onMounted(async () => {
  await subscriptionStore.getAllSubscriptions(userStore.loggedInUser!.id);
})

function getNextPaymentDate(startDate: string | Date, interval: number): Date {
  const start = new Date(startDate);
  const now = new Date();

  let nextPayment = new Date(start);

  // Keep adding the interval until we get a date in the future
  while (nextPayment < now) {
    nextPayment.setDate(nextPayment.getDate() + interval);
  }

  return nextPayment;
}


const addNewSubscription = async () => {
  
  if (!newSubscription.value?.name || !newSubscription.value?.startDate) return;
  newSubscription.value.userId = userStore.loggedInUser!.id;
  if (newSubscription.value.id) {
    await subscriptionStore.updateSubscription(newSubscription.value); // if editing
    toggleForm();
  } else {
    await subscriptionStore.addSubscription(newSubscription.value); // if adding new
    toggleForm();
  }
  // Reset the form
  newSubscription.value = {
    id: '',
    userId: '',
    name: '',
    description: '',
    price: 0,
    startDate: new Date(),
    interval: 30,
    currency: 'EUR'
  } as ISubscription;
};

const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value;
  if (!isFormVisible.value) {
    newSubscription.value = {
      id: '',
      userId: '',
      name: '',
      description: '',
      price: 0,
      startDate: new Date(),
      interval: 30,
      currency: 'EUR'
    } as ISubscription;
  }
};

const toggleDetails = (subscription: ISubscription) => {
  if (selectedSubscription.value === subscription) {
    selectedSubscription.value = null;
  } else {
    selectedSubscription.value = subscription;
  }
};

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
  return `${day}-${month}-${year}`;
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>