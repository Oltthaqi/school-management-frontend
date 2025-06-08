<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ authStore.user?.firstName }}!</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Students</p>
              <p class="text-2xl font-semibold text-gray-900">1,234</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Teachers</p>
              <p class="text-2xl font-semibold text-gray-900">89</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <AcademicCapIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Courses</p>
              <p class="text-2xl font-semibold text-gray-900">156</p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Enrollments</p>
              <p class="text-2xl font-semibold text-gray-900">3,456</p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClipboardDocumentListIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Enrollments</h3>
          <div class="space-y-3">
            <div v-for="i in 5" :key="i" class="flex items-center justify-between py-2">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Student Name {{ i }}</p>
                  <p class="text-xs text-gray-500">Course Name {{ i }}</p>
                </div>
              </div>
              <span class="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Grades</h3>
          <div class="space-y-3">
            <div v-for="i in 5" :key="i" class="flex items-center justify-between py-2">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Student Name {{ i }}</p>
                  <p class="text-xs text-gray-500">Course Name {{ i }}</p>
                </div>
              </div>
              <span class="text-sm font-semibold text-green-600">A+</span>
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
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
</script>