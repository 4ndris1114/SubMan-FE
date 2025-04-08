<template>
    <div class="fixed inset-0 blur-none flex items-center justify-center w-full mx-auto z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm">
        <h2 class="text-xl font-semibold mb-4">Delete Subscription</h2>
        <p class="mb-6">Are you sure you want to delete this subscription? <br>This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button @click="$emit('cancel')" class="px-4 py-2 text-gray-700 hover:text-gray-900 cursor-pointer">
            Cancel
          </button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">
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
