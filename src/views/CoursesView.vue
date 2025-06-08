<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Courses</h1>
        <button
          v-if="authStore.isAdmin || authStore.isTeacher"
          class="btn-primary"
        >
          Add Course
        </button>
      </div>

      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card hover:shadow-md transition-shadow duration-200">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">CS101</h3>
              <p class="text-sm text-gray-600">Introduction to Programming</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              3 Credits
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-4">
            Basic programming concepts and problem-solving skills using modern programming languages.
          </p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
              <span class="text-sm text-gray-600">John Smith</span>
            </div>
            <div class="flex space-x-2">
              <button class="text-blue-600 hover:text-blue-500 text-sm">View</button>
              <button v-if="authStore.isAdmin" class="text-green-600 hover:text-green-500 text-sm">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/layout/AppLayout.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>