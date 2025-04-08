
<template>
    <div class="w-[400px] h-[300px] shadow-xl rounded-2xl p-4">
      <h3 class="text-center font-semibold mb-2">Money Spent in {{ new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }) }}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart :data="data">
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" stroke-width="3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </template>  
<script setup lang="ts">
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ISubscription } from '@/types/interfaces/ISubscription';
import { computed } from 'vue';

const props = defineProps<{
  subscriptions: ISubscription[],
  currentMonth: number,
  currentYear: number
}>();

const data = computed(() => {
  const daysInMonth = new Date(props.currentYear, props.currentMonth + 1, 0).getDate();
  const result = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayTotal = props.subscriptions
      .filter(sub => {
        const date = new Date(sub.startDate);
        return date.getFullYear() === props.currentYear && date.getMonth() === props.currentMonth && date.getDate() === day;
      })
      .reduce((sum, sub) => sum + sub.price, 0);

    result.push({
      day: day.toString(),
      total: dayTotal
    });
  }

  return result;
});
</script>