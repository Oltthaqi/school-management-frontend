<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Grades</h1>
      </div>

      <!-- Grades Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th>Letter Grade</th>
                <th>Graded Date</th>
                <th>Comments</th>
                <th v-if="authStore.isTeacher || authStore.isAdmin">Actions</th>
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
                <td>
                  <span class="font-semibold text-green-600">95.0</span>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    A+
                  </span>
                </td>
                <td>Dec 15, 2023</td>
                <td class="max-w-xs truncate">Excellent work on the final project</td>
                <td v-if="authStore.isTeacher || authStore.isAdmin">
                  <div class="flex space-x-2">
                    <button class="text-green-600 hover:text-green-500">Edit</button>
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