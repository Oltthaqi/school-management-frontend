<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Teachers</h1>
        <Button @click="showCreateModal = true">
          Add Teacher
        </Button>
      </div>

      <!-- Teachers Table -->
      <Card>
        <Table>
          <template #header>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </template>
          
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ teacher.employeeId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ teacher.firstName }} {{ teacher.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ teacher.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ teacher.department }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ teacher.specialization || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  @click="viewTeacher(teacher)"
                >
                  View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  @click="editTeacher(teacher)"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  @click="confirmDelete(teacher)"
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
    <Modal v-if="showCreateModal || editingTeacher" @close="closeModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingTeacher ? "Edit Teacher" : "Add New Teacher" }}
        </h3>

        <form @submit.prevent="saveTeacher" class="space-y-4">
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

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Employee ID</label>
              <input
                v-model="form.employeeId"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">Department</label>
              <input
                v-model="form.department"
                type="text"
                required
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">Phone Number</label>
            <input v-model="form.phoneNumber" type="tel" class="form-input" />
          </div>

          <div>
            <label class="form-label">Specialization</label>
            <input
              v-model="form.specialization"
              type="text"
              class="form-input"
            />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="closeModal">
              Cancel
            </Button>
            <Button type="submit">
              {{ editingTeacher ? "Update" : "Create" }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Detail Modal -->
    <DetailModal
      v-if="viewingTeacher"
      :title="`Teacher Details - ${viewingTeacher.firstName} ${viewingTeacher.lastName}`"
      @close="viewingTeacher = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Employee ID</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingTeacher.employeeId }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingTeacher.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Department</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingTeacher.department }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingTeacher.phoneNumber || 'N/A' }}</p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Specialization</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingTeacher.specialization || 'N/A' }}</p>
        </div>
      </div>
    </DetailModal>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="teacherToDelete"
      title="Delete Teacher"
      message="Are you sure you want to delete this teacher? This action cannot be undone."
      confirm-text="Delete"
      @confirm="deleteTeacher"
      @cancel="teacherToDelete = null"
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
import { teacherService } from "../services/teacherService";
import type { Teacher } from "../types";

const teachers = ref<Teacher[]>([]);
const showCreateModal = ref(false);
const editingTeacher = ref<Teacher | null>(null);
const viewingTeacher = ref<Teacher | null>(null);
const teacherToDelete = ref<Teacher | null>(null);

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  employeeId: "",
  department: "",
  phoneNumber: "",
  specialization: "",
});

const loadTeachers = async () => {
  try {
    teachers.value = await teacherService.getAll();
  } catch (error) {
    console.error("Failed to load teachers:", error);
  }
};

const viewTeacher = async (teacher: Teacher) => {
  try {
    viewingTeacher.value = await teacherService.getById(teacher.id);
  } catch (error) {
    console.error("Failed to load teacher details:", error);
  }
};

const editTeacher = (teacher: Teacher) => {
  editingTeacher.value = teacher;
  Object.assign(form, {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    employeeId: teacher.employeeId,
    department: teacher.department,
    phoneNumber: teacher.phoneNumber || "",
    specialization: teacher.specialization || "",
  });
};

const confirmDelete = (teacher: Teacher) => {
  teacherToDelete.value = teacher;
};

const deleteTeacher = async () => {
  if (!teacherToDelete.value) return;
  
  try {
    await teacherService.delete(teacherToDelete.value.id);
    await loadTeachers();
    teacherToDelete.value = null;
  } catch (error) {
    console.error("Failed to delete teacher:", error);
  }
};

const saveTeacher = async () => {
  try {
    if (editingTeacher.value) {
      await teacherService.update(editingTeacher.value.id, form);
    } else {
      await teacherService.create(form);
    }
    await loadTeachers();
    closeModal();
  } catch (error) {
    console.error("Failed to save teacher:", error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingTeacher.value = null;
  Object.assign(form, {
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    department: "",
    phoneNumber: "",
    specialization: "",
  });
};

onMounted(() => {
  loadTeachers();
});
</script>