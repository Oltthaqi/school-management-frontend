<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import ResourceTable from "../ui/ResourceTable.vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import BaseInput from "../ui/BaseInput.vue";
import { useAuthStore } from "../../stores/auth";
import { studentService } from "../../services/studentService";
import type { Student } from "../../types";
import { toast } from "vue3-toastify";
import CreateOrEditStudentModal from "./CreateOrEditStudentModal.vue";
import { studentColumns, studentActions } from "../../utils/constants";

const authStore = useAuthStore();

const students = ref<Student[]>([]);
const showCreateModal = ref(false);
const editingStudent = ref<Student | null>(null);
const viewingStudent = ref<Student | null>(null);
const studentToDelete = ref<Student | null>(null);

const loadStudents = async () => {
  try {
    students.value = await studentService.getAll();
  } catch (error) {
    console.error("Failed to load students:", error);
    toast.error("Failed to load students.");
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const viewStudent = async (student: Student) => {
  try {
    viewingStudent.value = await studentService.getById(student.id);
  } catch (error) {
    console.error("Failed to load student details:", error);
    toast.error("Failed to load student details.");
  }
};

const editStudent = (student: Student) => {
  editingStudent.value = student;
  showCreateModal.value = true;
};

const confirmDelete = (student: Student) => {
  studentToDelete.value = student;
};

const deleteStudent = async () => {
  if (!studentToDelete.value) return;
  try {
    await studentService.delete(studentToDelete.value.id);
    await loadStudents();
    toast.success("Student deleted successfully.");
    studentToDelete.value = null;
  } catch (error) {
    console.error("Failed to delete student:", error);
    toast.error("Failed to delete student.");
  }
};

const saveStudent = async (formData: Partial<Student>) => {
  try {
    if (editingStudent.value) {
      await studentService.update(editingStudent.value.id, formData);
      toast.success("Student updated successfully.");
    } else {
      await studentService.create(formData);
      toast.success("Student created successfully.");
    }
    await loadStudents();
    closeModal();
  } catch (error: any) {
    console.error("Failed to save student:", error);
    toast.error(error?.response?.data?.message || "Failed to save student.");
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingStudent.value = null;
};

onMounted(() => {
  loadStudents();
});
</script>

<template>
  <AppLayout>
    <ResourceTable
      title="Students"
      :items="students"
      :columns="studentColumns(formatDate)"
      :actions="
        studentActions(
          viewStudent,
          editStudent,
          confirmDelete,
          authStore.isAdmin
        )
      "
      :onCreate="() => (showCreateModal = true)"
      :canCreate="authStore.isAdmin"
    />

    <CreateOrEditStudentModal
      v-if="showCreateModal || editingStudent"
      :show="true"
      :student="editingStudent"
      @close="closeModal"
      @save="saveStudent"
    />

    <DetailModal
      v-if="viewingStudent"
      :title="`Student Details - ${viewingStudent.firstName} ${viewingStudent.lastName}`"
      @close="viewingStudent = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Student ID</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingStudent.studentId }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingStudent.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Date of Birth</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ formatDate(viewingStudent.dateOfBirth) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Admission Date</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ formatDate(viewingStudent.admissionDate) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Phone Number</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingStudent.phoneNumber || "N/A" }}
          </p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Address</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingStudent.address || "N/A" }}
          </p>
        </div>
      </div>
    </DetailModal>

    <ConfirmationModal
      v-if="studentToDelete"
      title="Delete Student"
      message="Are you sure you want to delete this student? This action cannot be undone."
      confirm-text="Delete"
      @confirm="deleteStudent"
      @cancel="studentToDelete = null"
    />
  </AppLayout>
</template>
