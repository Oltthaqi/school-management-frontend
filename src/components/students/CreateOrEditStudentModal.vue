<script setup lang="ts">
import { reactive, watch } from "vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import BaseInput from "../ui/BaseInput.vue";
import type { Student } from "../../types";

const props = defineProps<{
  show: boolean;
  student: Student | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", form: Partial<Student>): void;
}>();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  studentId: "",
  dateOfBirth: "",
  admissionDate: "",
  phoneNumber: "",
  address: "",
});

watch(
  () => props.student,
  (student) => {
    if (student) {
      Object.assign(form, student);
    } else {
      Object.assign(form, {
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        dateOfBirth: "",
        admissionDate: "",
        phoneNumber: "",
        address: "",
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
        {{ props.student ? "Edit Student" : "Add New Student" }}
      </h3>
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <BaseInput v-model="form.firstName" label="First Name" required />
          <BaseInput v-model="form.lastName" label="Last Name" required />
        </div>
        <BaseInput v-model="form.email" label="Email" type="email" required />
        <BaseInput v-model="form.studentId" label="Student ID" required />
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.dateOfBirth"
            label="Date of Birth"
            type="date"
          />
          <BaseInput
            v-model="form.admissionDate"
            label="Admission Date"
            type="date"
          />
        </div>
        <BaseInput v-model="form.phoneNumber" label="Phone Number" type="tel" />
        <BaseInput v-model="form.address" label="Address" textarea />
        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" @click="emit('close')">Cancel</Button>
          <Button type="submit">
            {{ props.student ? "Update" : "Create" }}
          </Button>
        </div>
      </form>
    </div>
  </Modal>
</template>
