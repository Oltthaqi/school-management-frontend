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

const authStore = useAuthStore();

const students = ref<Student[]>([]);
const showCreateModal = ref(false);
const editingStudent = ref<Student | null>(null);
const viewingStudent = ref<Student | null>(null);
const studentToDelete = ref<Student | null>(null);

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

const loadStudents = async () => {
  try {
    students.value = await studentService.getAll();
  } catch (error) {
    console.error("Failed to load students:", error);
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
  }
};

const editStudent = (student: Student) => {
  editingStudent.value = student;
  Object.assign(form, {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    studentId: student.studentId,
    dateOfBirth: student.dateOfBirth || "",
    admissionDate: student.admissionDate || "",
    phoneNumber: student.phoneNumber || "",
    address: student.address || "",
  });
};

const confirmDelete = (student: Student) => {
  studentToDelete.value = student;
};

const deleteStudent = async () => {
  if (!studentToDelete.value) return;
  try {
    await studentService.delete(studentToDelete.value.id);
    await loadStudents();
    studentToDelete.value = null;
  } catch (error) {
    console.error("Failed to delete student:", error);
  }
};

const saveStudent = async () => {
  try {
    if (editingStudent.value) {
      await studentService.update(editingStudent.value.id, form);
    } else {
      await studentService.create(form);
    }
    await loadStudents();
    closeModal();
  } catch (error) {
    console.error("Failed to save student:", error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingStudent.value = null;
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
      :columns="[
        { label: 'Student ID', field: 'studentId' },
        {
          label: 'Name',
          field: 'fullName',
          format: (_, s) => s.firstName + ' ' + s.lastName,
        },
        { label: 'Email', field: 'email' },
        { label: 'Admission Date', field: 'admissionDate', format: formatDate },
      ]"
      :actions="[
        { label: 'View', onClick: viewStudent },
        {
          label: 'Edit',
          onClick: editStudent,
          show: () => authStore.isAdmin,
          variant: 'primary',
        },
        {
          label: 'Delete',
          onClick: confirmDelete,
          show: () => authStore.isAdmin,
          variant: 'danger',
        },
      ]"
      :onCreate="() => (showCreateModal = true)"
      :canCreate="authStore.isAdmin"
    />

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal || editingStudent" @close="closeModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingStudent ? "Edit Student" : "Add New Student" }}
        </h3>
        <form @submit.prevent="saveStudent" class="space-y-4">
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
          <BaseInput
            v-model="form.phoneNumber"
            label="Phone Number"
            type="tel"
          />
          <BaseInput v-model="form.address" label="Address" textarea rows="3" />
          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="closeModal">Cancel</Button>
            <Button type="submit">
              {{ editingStudent ? "Update" : "Create" }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Detail Modal -->
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

    <!-- Confirmation Modal -->
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
