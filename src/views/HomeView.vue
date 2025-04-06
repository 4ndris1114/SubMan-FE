<template>
    <div class="min-h-screen bg-gray-50">
        <Navbar />
        <div class="min-h-screen">
            <UpcomingPayment />
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import UpcomingPayment from '@/components/UpcomingPayment.vue';
</script>

<style scoped>

</style>