<template>
  <Modal @close="$emit('cancel')">
    <div class="p-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900">
            {{ title }}
          </h3>
        </div>
      </div>
      
      <div class="mb-6">
        <p class="text-sm text-gray-500">
          {{ message }}
        </p>
      </div>
      
      <div class="flex justify-end space-x-3">
        <Button variant="secondary" @click="$emit('cancel')">
          Cancel
        </Button>
        <Button variant="danger" @click="$emit('confirm')">
          {{ confirmText }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import Button from './Button.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
  message: string
  confirmText?: string
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm'
})

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>