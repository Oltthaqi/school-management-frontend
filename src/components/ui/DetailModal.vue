<template>
  <Modal @close="$emit('close')">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ title }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
      
      <div class="space-y-4">
        <slot />
      </div>
      
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <slot name="actions">
          <Button variant="secondary" @click="$emit('close')">
            Close
          </Button>
        </slot>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import Button from './Button.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>