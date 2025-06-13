// components/teachers/TeacherModal.vue
<script setup lang="ts">
import { reactive, watch } from "vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import BaseInput from "../ui/BaseInput.vue";
import type { Teacher } from "../../types";

const props = defineProps<{
  show: boolean;
  teacher: Teacher | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", form: Partial<Teacher>): void;
}>();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  employeeId: "",
  department: "",
  phoneNumber: "",
  specialization: "",
});

watch(
  () => props.teacher,
  (teacher) => {
    if (teacher) {
      Object.assign(form, teacher);
    } else {
      Object.assign(form, {
        firstName: "",
        lastName: "",
        email: "",
        employeeId: "",
        department: "",
        phoneNumber: "",
        specialization: "",
      });
    }
  },
  { immediate: true }
);

const save = () => {
  emit("save", { ...form });
};
</script>

<template>
  <Modal :show="show" @close="emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {{ props.teacher ? "Edit Teacher" : "Add New Teacher" }}
      </h3>
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <BaseInput v-model="form.firstName" label="First Name" required />
          <BaseInput v-model="form.lastName" label="Last Name" required />
        </div>
        <BaseInput v-model="form.email" label="Email" type="email" required />
        <div class="grid grid-cols-2 gap-4">
          <BaseInput v-model="form.employeeId" label="Employee ID" required />
          <BaseInput v-model="form.department" label="Department" required />
        </div>
        <BaseInput v-model="form.phoneNumber" label="Phone Number" type="tel" />
        <BaseInput v-model="form.specialization" label="Specialization" />

        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" @click="emit('close')">Cancel</Button>
          <Button type="submit">
            {{ props.teacher ? "Update" : "Create" }}
          </Button>
        </div>
      </form>
    </div>
  </Modal>
</template>
