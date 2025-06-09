<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <component
      :is="textarea ? 'textarea' : 'input'"
      class="form-input"
      :type="type || 'text'"
      :rows="textarea ? rows || 3 : undefined"
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
