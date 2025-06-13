<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import type { Student, Course } from "../../types";
import { toast } from "vue3-toastify";
import { enrollmentService } from "../../services/enrollmentService";

const props = defineProps<{
  show: boolean;
  students: Student[];
  courses: Course[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const form = reactive({
  studentId: "",
  courseId: "",
});

const resetForm = () => {
  form.studentId = "";
  form.courseId = "";
};

const saveEnrollment = async () => {
  try {
    await enrollmentService.create({
      studentId: parseInt(form.studentId),
      courseId: parseInt(form.courseId),
      status: "ACTIVE",
    });
    toast.success("Enrollment created successfully.");
    emit("saved");
    emit("close");
    resetForm();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to create enrollment."
    );
  }
};

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) resetForm();
  }
);
</script>

<template>
  <Modal v-if="show" @close="emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Enrollment</h3>
      <form @submit.prevent="saveEnrollment" class="space-y-4">
        <div>
          <label class="form-label">Student</label>
          <select v-model="form.studentId" required class="form-input">
            <option value="">Select a student</option>
            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.firstName }} {{ student.lastName }} ({{
                student.studentId
              }})
            </option>
          </select>
        </div>

        <div>
          <label class="form-label">Course</label>
          <select v-model="form.courseId" required class="form-input">
            <option value="">Select a course</option>
            <option
              v-for="course in courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.courseCode }} - {{ course.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" @click="emit('close')">Cancel</Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  </Modal>
</template>
