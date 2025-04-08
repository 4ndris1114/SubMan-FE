<template>
    <div class="w-[400px] h-[300px] shadow-xl rounded-2xl p-4">
      <h3 class="text-center font-semibold mb-2">
        Money Spent in {{ new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }) }}
      </h3>
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
  import { ref, computed } from 'vue';
  
  // For testing purposes, simulate random data
  const currentMonth = 3; // April (0-indexed month)
  const currentYear = 2025;
  
  const data = computed(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();  // Get total number of days in the month
    const result = [];
  
    for (let day = 1; day <= daysInMonth; day++) {
      // Simulate random data for daily totals (between 0 and 500)
      const dayTotal = Math.floor(Math.random() * 500); 
  
      result.push({
        day: day.toString(),
        total: dayTotal
      });
    }
  
    return result;
  });
  </script>
  
  <style scoped></style>  