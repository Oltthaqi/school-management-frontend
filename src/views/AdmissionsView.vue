<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Admissions</h1>
        <button class="btn-primary">Add Admission</button>
      </div>

      <!-- Admissions Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Application Number</th>
                <th>Student</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Decision Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="font-medium">APP001</td>
                <td>
                  <div>
                    <p class="font-medium">Jane Doe</p>
                    <p class="text-sm text-gray-500">jane.doe@email.com</p>
                  </div>
                </td>
                <td>Aug 1, 2023</td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Approved
                  </span>
                </td>
                <td>Aug 15, 2023</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-500">View</button>
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
</script>