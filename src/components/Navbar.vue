<template>
    <!-- Header -->
    <header class="fixed top-0 w-full bg-purple-700 text-white shadow-sm z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <!-- Logo -->
            <nav class="text-2xl font-bold text-white">
                <router-link to="/" class="text-white">SubMan</router-link>
            </nav>

            <!-- Navigation -->
            <nav class="flex items-center gap-6 ml-8">
                <router-link to="/" class="text-white hover:text-gray-300 font-medium">Home</router-link>
                <router-link to="/subscriptions" class="text-white hover:text-gray-300 font-medium">
                    My Subscriptions
                </router-link>
            </nav>

            <Searchbar />

            <!-- User actions -->
            <div class="flex items-center gap-6">
                <button class="relative rounded-full cursor-pointer text-white">
                    <fa icon="cog" class="scale-140 text-white" />
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button class="relative rounded-full cursor-pointer text-white">
                    <fa icon="bell" class="scale-140 text-white" />
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div class="cursor-pointer flex items-center justify-center w-8 h-8 bg-purple-900 text-white rounded-full">
                    <fa icon="user" class="text-white" />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
