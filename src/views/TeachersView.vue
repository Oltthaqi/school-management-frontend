<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Teachers</h1>
        <button
          @click="showCreateModal = true"
          class="btn-primary"
        >
          Add Teacher
        </button>
      </div>

      <!-- Teachers Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="font-medium">EMP001</td>
                <td>John Smith</td>
                <td>john.smith@school.com</td>
                <td>Computer Science</td>
                <td>Web Development</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-500">View</button>
                    <button class="text-green-600 hover:text-green-500">Edit</button>
                    <button class="text-red-600 hover:text-red-500">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Modal placeholder -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Teacher</h3>
        <p>Teacher form will be implemented here.</p>
        <div class="flex justify-end pt-4">
          <button @click="showCreateModal = false" class="btn-secondary">Close</button>
        </div>
      </div>
    </Modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import Modal from '../components/ui/Modal.vue'

const showCreateModal = ref(false)
</script>