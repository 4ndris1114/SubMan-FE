<template>
    <!-- Header -->
    <header class="fixed top-0 w-full bg-accent text-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="text-2xl font-bold text-blue-600">SubMan</div>

           <!-- Navigation -->
          <nav class="flex items-center gap-6 ml-8"><router-link to="/" class="text-blue-700 hover:text-blue-400 font-medium">Home</router-link>
            <router-link :to="`/subscriptions`" class="text-blue-700 hover:text-blue-400 font-medium">My Subscriptions</router-link>
          </nav>

            <Searchbar />

            <!-- User actions -->
            <div class="flex items-center gap-6">
              <button class="relative !rounded-button cursor-pointer">
                    <fa icon="message" class="scale-140" />
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button class="relative !rounded-button cursor-pointer">
                    <fa icon="bell" class="scale-140" />
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div
                    class="cursor-pointer flex items-center justify-center w-8 h-8 bg-blue-800 text-white rounded-full">
                    <fa icon="user" />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
