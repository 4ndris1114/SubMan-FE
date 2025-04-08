<template>
    <div class="flex justify-between bg-gray-300 overflow-x-hidden w-full min-h-screen items-start ">
        <!-- Left Section: Welcome Text -->
        <div class="flex-1  ml-20 mt-30">
            <h1 class="text-4xl font-extrabold text-left mb-4">
                Welcome back, {{ userStore.loggedInUser?.username }}!
            </h1>
            <p class="text-xl font-medium text-left mb-8 ml-1 text-gray-700">
                You have {{ paymentsThisWeek }} payment(s) to pay this week.
            </p>

            <div class="flex justify-center gap-4 flex-wrap ">
                <!-- Graph Placeholder -->
                <div class="flex flex-col items-center p-4 bg-gray-100 shadow-xl rounded-2xl w-full max-w-md">
                    <h2 class="text-2xl text-center font-medium mb-4">
                        Money spent in {{ currentMonthName }}
                    </h2>
                    <MoneySpentChart :subscriptions="subscriptions" :currentMonth="currentMonth" :currentYear="currentYear" />
                </div>
                <!-- Calendar Wrapper -->
                <div class="flex justify-center bg-gray-100 items-center p-4 shadow-xl rounded-2xl">

                    <div>
                        <!-- Month Navigation -->
                        <h2 class="text-2xl text-center font-medium  mb-4">
                            Upcoming Payments
                        </h2>
                        <div class="flex justify-between items-center mb-2">

                            <button @click="prevMonth" class="text-xl font-extrabold hover:text-purple-600">&lt;</button>
                            <h3 class="text-xl font-bold">{{ currentMonthName }} {{ currentYear }}</h3>
                            <button @click="nextMonth" class="text-xl font-extrabold hover:text-purple-600">&gt;</button>
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
                                        'border-red-700 border-2 bg-red-500 hover:bg-red-600': day.payments.length && isPast(day.date),
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
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useUserStore } from '@/stores/userStore';
import type { ISubscription } from '@/types/interfaces/ISubscription';
import { getCalendarForMonth } from '@/utils/calendarUtils.ts';
import MoneySpentChart from '@/components/MoneySpentChart.vue';

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const error = ref<string | null>(null);
const calendar = ref<Array<{ date: number; payments: ISubscription[] }>>([]);
const calendarDays = computed(() => calendar.value);

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
    calendar.value = getCalendarForMonth(subscriptions.value, currentMonth.value, currentYear.value);
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
    return dayDate === currentDay && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
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
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() - now.getDay() + 7); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);


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

</style>