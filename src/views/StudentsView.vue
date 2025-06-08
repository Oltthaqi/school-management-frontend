<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Students</h1>
        <Button
          v-if="authStore.isAdmin"
          @click="showCreateModal = true"
        >
          Add Student
        </Button>
      </div>

      <!-- Students Table -->
      <Card>
        <Table>
          <template #header>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </template>
          
          <tr v-for="student in students" :key="student.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ student.studentId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ student.firstName }} {{ student.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ student.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(student.admissionDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  @click="viewStudent(student)"
                >
                  View
                </Button>
                <Button
                  v-if="authStore.isAdmin"
                  variant="primary"
                  size="sm"
                  @click="editStudent(student)"
                >
                  Edit
                </Button>
                <Button
                  v-if="authStore.isAdmin"
                  variant="danger"
                  size="sm"
                  @click="confirmDelete(student)"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        </Table>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal || editingStudent" @close="closeModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingStudent ? "Edit Student" : "Add New Student" }}
        </h3>

        <form @submit.prevent="saveStudent" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">First Name</label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">Last Name</label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">Student ID</label>
            <input
              v-model="form.studentId"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Date of Birth</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">Admission Date</label>
              <input
                v-model="form.admissionDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">Phone Number</label>
            <input v-model="form.phoneNumber" type="tel" class="form-input" />
          </div>

          <div>
            <label class="form-label">Address</label>
            <textarea
              v-model="form.address"
              rows="3"
              class="form-input"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="closeModal">
              Cancel
            </Button>
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
          <label class="block text-sm font-medium text-gray-700">Student ID</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingStudent.studentId }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingStudent.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(viewingStudent.dateOfBirth) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Admission Date</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(viewingStudent.admissionDate) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingStudent.phoneNumber || 'N/A' }}</p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Address</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingStudent.address || 'N/A' }}</p>
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

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../components/layout/AppLayout.vue";
import Modal from "../components/ui/Modal.vue";
import Button from "../components/ui/Button.vue";
import Card from "../components/ui/Card.vue";
import Table from "../components/ui/Table.vue";
import DetailModal from "../components/ui/DetailModal.vue";
import ConfirmationModal from "../components/ui/ConfirmationModal.vue";
import { useAuthStore } from "../stores/auth";
import { studentService } from "../services/studentService";
import type { Student } from "../types";

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

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  loadStudents();
});
</script>