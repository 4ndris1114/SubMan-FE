<template>
    <div class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-xl font-semibold mb-4">Delete Subscription</h2>
        <p class="mb-6">Are you sure you want to delete this subscription? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button @click="$emit('cancel')" class="px-4 py-2 text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style scoped>
  </style>
  