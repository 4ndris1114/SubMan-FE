<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <LoginForm v-if="!isRegistering" @signup="isRegistering = true" />
        <RegisterForm v-if="isRegistering" @signin="isRegistering = false" />
    </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import { ref } from 'vue';

const isRegistering = ref(
    new URLSearchParams(window.location.search).get('isRegistering') === 'true'
);
</script>

<style scoped></style>