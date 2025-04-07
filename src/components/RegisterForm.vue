<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
            <!-- Logo -->
            <div class="flex justify-center">
                <fa icon="otter" class="text-4xl text-purple-600" />
            </div>

            <!-- Welcome Text -->
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Create an Account</h2>
                <p class="mt-2 text-sm text-gray-600">Sign up to start using SubMan</p>
            </div>

            <!-- Register Form -->
            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="space-y-4">
                    <!-- Name Input -->
                    <div>
                        <label for="username" class="sr-only">Username</label>
                        <div class="relative">
                            <fa icon="user" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa>
                            <input id="username" v-model="username" type="text" required
                                class="peer appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Username" />
                        </div>
                        <p v-if="usernameError" class="mt-1 text-xs text-red-500">{{ usernameError }}</p>
                    </div>

                    <!-- Email Input -->
                    <div>
                        <label for="email" class="sr-only">Email address</label>
                        <div class="relative">
                            <fa icon="envelope" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa>
                            <input id="email" v-model="email" type="email" required
                                class="peer appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Email address" />
                        </div>
                        <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
                    </div>

                    <!-- Password Input -->
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <div class="relative">
                            <fa icon="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa>
                            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required
                                class="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Password" />
                            <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                @click="togglePassword">
                                <fa :icon="showPassword ? 'eye-slash' : 'eye'" class="text-gray-400"></fa>
                            </button>
                        </div>
                        <p v-if="passwordError" class="mt-1 text-xs text-red-500">{{ passwordError }}</p>
                    </div>
                    <div>
                        <label for="confirmPassword" class="sr-only">Password</label>
                        <div class="relative">
                            <fa icon="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa>
                            <input id="confirmPassword" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                                class="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Repeat password" />
                            <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                @click="toggleConfirmPassword">
                                <fa :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-gray-400"></fa>
                            </button>
                        </div>
                        <p v-if="passwordMatchError" class="mt-1 text-xs text-red-500">{{ passwordMatchError }}</p>
                    </div>
                </div>

                <!-- Register Button -->
                <button type="submit"
                    class="!rounded-button group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-purple-700 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap cursor-pointer"
                    :disabled="isLoading">
                    <span v-if="isLoading" class="absolute left-1/2 transform -translate-x-1/2">
                        <fa icon="spinner" class="animate-spin" />
                    </span>
                    <span :class="{ invisible: isLoading }">Sign Up</span>
                </button>
            </form>

            <!-- Sign In Link -->
            <p class="mt-8 text-center text-sm text-gray-600">
                Already have an account?
                <a href="#" class="font-medium text-purple-700 hover:text-purple-500" @click="handleSignIn">
                    Sign in
                </a>
            </p>
        </div>

        <!-- Toast Notification -->
        <div v-if="showToast" class="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3"
            :class="toastType === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'">
            <fa :icon="toastType === 'error' ? 'exclamation-circle' : 'check-circle'" 
                :class="toastType === 'error' ? 'text-red-500' : 'text-green-500'"></fa>
            <p class="text-sm text-gray-600">{{ toastMessage }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('isRegistering', 'true');
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
});


// stores
const userStore = useUserStore();

// state
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const passwordMatchError = ref('');
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

// emits
const emit = defineEmits(['signin']);

const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
};

const validatePasswordMatch = () => {
    if (password.value !== confirmPassword.value) {
        passwordMatchError.value = 'Passwords do not match';
        return false;
    } else {
        passwordMatchError.value = '';
        return true;
    }
};

const validateUsername = (username: string) => {
    const re = /^[a-zA-Z0-9_]{3,16}$/;
    return re.test(username);
}

const handleRegister = async () => {
    usernameError.value = '';
    emailError.value = '';
    passwordError.value = '';
    passwordMatchError.value = '';
    if (!validateEmail(email.value)) {
        emailError.value = 'Please enter a valid email address';
        return;
    }

    if (!validatePassword(password.value)) {
        passwordError.value = 'Password must be at least 8 characters long and contain at least one letter and one number';
        return;
    }

    if (!validatePasswordMatch()) {
        return;
    }

    if (!validateUsername(username.value)) {
        usernameError.value = 'Username must be between 3 and 16 characters and can only contain letters, numbers, and underscores';
        return;
    }
    
    emailError.value = '';
    isLoading.value = true;

    try {
        await userStore.register(username.value, email.value, password.value);
        showNotification('Successfully registered!', 'success');
        emit('signin');
    } catch (error) {
        if (error.response.data === "Email already exists") {
            emailError.value = error.response.data;
        } else if (error.response.data === "Username already exists") {
            usernameError.value = error.response.data;
        }
        showNotification('Registration failed. Please try again.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showNotification = (message: string, type: 'success' | 'error') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
};

const handleSignIn = () => {
    showNotification('Redirecting to sign up page...', 'success');
    emit('signin');
};
</script>

<style scoped>
.fa-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input:-webkit-autofill {
    background-color: transparent !important;
    -webkit-text-fill-color: #000 !important;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
