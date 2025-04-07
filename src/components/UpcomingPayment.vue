<template>
        <div>
            <h1 class="text-2xl font-bold text-center mt-30">Upcoming Payments:</h1>

            <!-- Simple Calendar -->
            <div class="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
                <div class="grid grid-cols-7 gap-2 text-center font-bold">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
                <div class="grid grid-cols-7 gap-2 mt-2">
                    <div v-for="(day, index) in calendarDays" :key="index" class="h-16 border flex items-center justify-center relative">
                        <span>{{ day.date }}</span>
                        <div v-if="day.payments.length" class="absolute bottom-1 text-xs text-red-500">
                            {{ day.payments.length }} payment(s)
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useUserStore } from '@/stores/userStore';
import type { ISubscription } from '@/types/interfaces/ISubscription';
import { getCalendarForMonth } from '@/utils/calendarUtils.ts';

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const error = ref<string | null>(null);
const calendarDays = ref<Array<{ date: number; payments: ISubscription[] }>>([]);

onMounted(async () => {
    try {
        const payments = await subscriptionStore.getAllSubscriptions(userStore.loggedInUser!.id); // Fetch upcoming payments
        calendarDays.value = getCalendarForMonth(payments);  // Generate calendar with payment data
    } catch (err) {
        error.value = 'Failed to load calendar data';
    }
});
</script>

<style scoped>
.grid {
    display: grid;
}
</style>
