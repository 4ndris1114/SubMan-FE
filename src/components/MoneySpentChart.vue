<template>
  <div class="flex flex-col gap-6 text-center max-w-xl mx-auto">
    <!-- Header: Money Spent Per Currency -->
    <div>
      <div class="flex flex-col gap-2 text-4xl font-bold text-gray-800">
        <div v-for="(amount, currency) in moneySpentPerCurrency" :key="currency">
          {{ amount }}
          {{ currency === 'HUF' ? 'Ft' : currency === 'DKK' ? 'kr' : currency === 'EUR' ? '€' : '$' }}
        </div>
      </div>
    </div>

    <!-- Breakdown: Subscriptions Paid -->
    <div class="text-left text-base text-gray-700">
      <h3 class="font-medium mb-2 text-lg">You paid for:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li v-for="(subscription, index) in subscriptions" :key="subscription.id">
          {{ subscription.name }}
        </li>
      </ul>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ISubscription } from '@/types/interfaces/ISubscription';
import { computed } from 'vue';

const props = defineProps<{
  subscriptions: ISubscription[];
  currentMonth: number;
  currentYear: number;
}>();

const moneySpentPerCurrency = computed(() => {
  const result: Record<string, number> = {};

  props.subscriptions.forEach(subscription => {
    const startDate = new Date(subscription.startDate);
    const interval = subscription.interval;
    const currency = subscription.currency;

    let paymentDate = new Date(startDate);

    // Fast-forward to current month
    while (
      paymentDate.getFullYear() < props.currentYear ||
      (paymentDate.getFullYear() === props.currentYear &&
        paymentDate.getMonth() < props.currentMonth)
    ) {
      paymentDate.setDate(paymentDate.getDate() + interval);
    }

    // Check if a payment occurs in the current month
    if (
      paymentDate.getFullYear() === props.currentYear &&
      paymentDate.getMonth() === props.currentMonth
    ) {
      if (!result[currency]) result[currency] = 0;
      result[currency] += subscription.price;
    }
  });

  return result;
});

</script>

<style scoped></style>