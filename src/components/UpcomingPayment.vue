<template>
    <div class="flex justify-between items-start mx-20 mt-20">
        <!-- Left Section: Welcome Text -->
        <div class="flex-1">
            <h1 class="text-4xl font-extrabold text-left mb-4">
                Welcome back, <br> {{ userStore.loggedInUser?.username }}!
            </h1>
            <p class="text-xl font-medium text-left mb-8 text-gray-700">
                You have {{ paymentsThisWeek }} payment(s) to pay this week.
            </p>
        </div>
        <h2 class="text-2xl font-medium  mb-4">
            Upcoming Payments
        </h2>
        <!-- Calendar Wrapper -->
        <div class="flex justify-center items-center p-4 shadow-xl rounded-2xl">
            <div>
                <!-- Month Navigation -->
                <div class="flex justify-between items-center mb-2">
                    <button @click="prevMonth" class="text-xl font-extrabold hover:text-blue-600">&lt;</button>
                    <h3 class="text-xl font-bold">{{ currentMonthName }} {{ currentYear }}</h3>
                    <button @click="nextMonth" class="text-xl font-extrabold hover:text-blue-600">&gt;</button>
                </div>

                <!-- Weekdays -->
                <div class="grid grid-cols-7 gap-1 text-center font-semibold text-black mb-1 text-xs">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                    <div v-for="(day, index) in calendarDays" :key="index">
                        <div v-if="day.date"
                            class="h-10 w-10 flex flex-col items-center justify-center relative rounded-lg text-[14px] transition-all duration-300"
                            :class="{
                                'border-red-800 border-2 bg-red-600 hover:bg-red-500': day.payments.length && isPast(day.date),
                                'border-blue-800 border-2 bg-blue-600 hover:bg-blue-500': day.payments.length && !isPast(day.date),
                                'border-blue-600 border-4 hover:bg-blue-400': isToday(day.date) && !day.payments.length,
                                'hover:bg-blue-100': !isToday(day.date) && !day.payments.length,
                            }">
                            <span class="font-medium">{{ day.date }}</span>
                            <div v-if="day.payments.length"
                                class="absolute bottom-1 text-[9px] font-semibold text-white">
                                {{ day.payments.length }}x
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Graph Placeholder -->
    <div class="mt-8 w-full flex justify-center">
        <div class="w-[400px] h-[200px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            Graph: Money Spent per Day
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useUserStore } from '@/stores/userStore';
import type { ISubscription } from '@/types/interfaces/ISubscription';
import { getCalendarForMonth } from '@/utils/calendarUtils.ts';

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const error = ref<string | null>(null);
const calendarDays = ref<Array<{ date: number; payments: ISubscription[] }>>([]);

const subscriptions = computed(() => subscriptionStore.subscriptions);

const today = new Date();
const isPast = (dayDate: number) => {
    const dayDateTime = new Date(today.getFullYear(), today.getMonth(), dayDate).getTime();
    const now = today.getTime();
    return dayDateTime < now;
};

const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const currentMonthName = computed(() =>
    new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long' })
);

const loadCalendar = () => {
    calendarDays.value = getCalendarForMonth(subscriptions.value, currentMonth.value, currentYear.value);
};

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
    loadCalendar();
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
    loadCalendar();
};

onMounted(async () => {
    try {
        await subscriptionStore.getAllSubscriptions(userStore.loggedInUser!.id);
        loadCalendar();
    } catch (err) {
        error.value = 'Failed to load calendar data';
    }
});

const isToday = (dayDate: number) => {
    const currentDay = today.getDate();
    return dayDate === currentDay;
};

onMounted(async () => {
    try {
        await subscriptionStore.getAllSubscriptions(userStore.loggedInUser!.id);
        calendarDays.value = getCalendarForMonth(subscriptions.value);
    } catch (err) {
        error.value = 'Failed to load calendar data';
    }
});

const paymentsThisWeek = computed(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 7); // Sunday

    let count = 0;

    subscriptions.value.forEach((payment) => {
        const paymentDate = new Date(payment.startDate);
        if (paymentDate >= startOfWeek && paymentDate <= endOfWeek) {
            count++;
        }
    });

    return count;
});

</script>

<style scoped>
.grid {
    display: grid;
}
</style>