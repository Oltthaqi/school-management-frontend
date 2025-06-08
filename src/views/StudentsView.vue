<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Students</h1>
        <button
          v-if="authStore.isAdmin"
          @click="showCreateModal = true"
          class="btn-primary"
        >
          Add Student
        </button>
      </div>

      <!-- Students Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="student in students" :key="student.id">
                <td class="font-medium">{{ student.studentId }}</td>
                <td>{{ student.firstName }} {{ student.lastName }}</td>
                <td>{{ student.email }}</td>
                <td>{{ formatDate(student.admissionDate) }}</td>
                <td>
                  <div class="flex space-x-2">
                    <button
                      @click="viewStudent(student)"
                      class="text-blue-600 hover:text-blue-500"
                    >
                      View
                    </button>
                    <button
                      v-if="authStore.isAdmin"
                      @click="editStudent(student)"
                      class="text-green-600 hover:text-green-500"
                    >
                      Edit
                    </button>
                    <button
                      v-if="authStore.isAdmin"
                      @click="deleteStudent(student)"
                      class="text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ editingStudent ? "Update" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../components/layout/AppLayout.vue";
import Modal from "../components/ui/Modal.vue";
import { useAuthStore } from "../stores/auth";
import { studentService } from "../services/studentService";
import type { Student } from "../types";

const authStore = useAuthStore();

const students = ref<Student[]>([]);
const showCreateModal = ref(false);
const editingStudent = ref<Student | null>(null);

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

const viewStudent = (student: Student) => {
  try {
    studentService.getById(student.id);
  } catch (error) {
    console.log(error);
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

const deleteStudent = async (student: Student) => {
  if (confirm("Are you sure you want to delete this student?")) {
    try {
      await studentService.delete(student.id);
      await loadStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
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
