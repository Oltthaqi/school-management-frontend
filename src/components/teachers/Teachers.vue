<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import ResourceTable from "../ui/ResourceTable.vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import BaseInput from "../ui/BaseInput.vue";
import { teacherService } from "../../services/teacherService";
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

<template>
  <AppLayout>
    <ResourceTable
      title="Teachers"
      :items="teachers"
      :columns="[
        { label: 'Employee ID', field: 'employeeId' },
        {
          label: 'Name',
          field: 'fullName',
          format: (_, t) => t.firstName + ' ' + t.lastName,
        },
        { label: 'Email', field: 'email' },
        { label: 'Department', field: 'department' },
        {
          label: 'Specialization',
          field: 'specialization',
          format: (value) => value || 'N/A',
        },
      ]"
      :actions="[
        { label: 'View', onClick: viewTeacher },
        { label: 'Edit', onClick: editTeacher, variant: 'primary' },
        { label: 'Delete', onClick: confirmDelete, variant: 'danger' },
      ]"
      :onCreate="() => (showCreateModal = true)"
      :canCreate="true"
    />

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal || editingTeacher" @close="closeModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingTeacher ? "Edit Teacher" : "Add New Teacher" }}
        </h3>
        <form @submit.prevent="saveTeacher" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <BaseInput v-model="form.firstName" label="First Name" required />
            <BaseInput v-model="form.lastName" label="Last Name" required />
          </div>
          <BaseInput v-model="form.email" label="Email" type="email" required />
          <div class="grid grid-cols-2 gap-4">
            <BaseInput v-model="form.employeeId" label="Employee ID" required />
            <BaseInput v-model="form.department" label="Department" required />
          </div>
          <BaseInput
            v-model="form.phoneNumber"
            label="Phone Number"
            type="tel"
          />
          <BaseInput v-model="form.specialization" label="Specialization" />

          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="closeModal">Cancel</Button>
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
          <label class="block text-sm font-medium text-gray-700"
            >Employee ID</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingTeacher.employeeId }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingTeacher.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Department</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingTeacher.department }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Phone Number</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingTeacher.phoneNumber || "N/A" }}
          </p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Specialization</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingTeacher.specialization || "N/A" }}
          </p>
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
