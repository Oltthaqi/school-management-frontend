<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Enrollments</h1>
        <button
          v-if="authStore.isAdmin"
          class="btn-primary"
        >
          Add Enrollment
        </button>
      </div>

      <!-- Enrollments Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrolled Date</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td>
                  <div>
                    <p class="font-medium">Jane Doe</p>
                    <p class="text-sm text-gray-500">STU001</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p class="font-medium">CS101</p>
                    <p class="text-sm text-gray-500">Introduction to Programming</p>
                  </div>
                </td>
                <td>Sept 1, 2023</td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td>
                  <span class="font-medium text-green-600">A+</span>
                </td>
                <td>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-500">View</button>
                    <button v-if="authStore.isTeacher || authStore.isAdmin" class="text-green-600 hover:text-green-500">Grade</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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