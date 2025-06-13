<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import ResourceTable from "../ui/ResourceTable.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import { teacherService } from "../../services/teacherService";
import type { Teacher } from "../../types";
import { toast } from "vue3-toastify";
import CreateOrEditTeacher from "./CreateOrEditTeacher.vue";
import { teacherColumns, teacherActions } from "../../utils/constants";

const teachers = ref<Teacher[]>([]);
const showCreateModal = ref(false);
const editingTeacher = ref<Teacher | null>(null);
const viewingTeacher = ref<Teacher | null>(null);
const teacherToDelete = ref<Teacher | null>(null);

const loadTeachers = async () => {
  try {
    teachers.value = await teacherService.getAll();
  } catch (error) {
    console.error("Failed to load teachers:", error);
    toast.error("Failed to load teachers.");
  }
};

const viewTeacher = async (teacher: Teacher) => {
  try {
    viewingTeacher.value = await teacherService.getById(teacher.id);
  } catch (error) {
    console.error("Failed to load teacher details:", error);
    toast.error("Failed to load teacher details.");
  }
};

const editTeacher = (teacher: Teacher) => {
  editingTeacher.value = teacher;
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
    toast.success("Teacher deleted successfully.");
  } catch (error) {
    console.error("Failed to delete teacher:", error);
    toast.error("Failed to delete teacher.");
  }
};

const saveTeacher = async (form: Partial<Teacher>) => {
  try {
    if (editingTeacher.value) {
      await teacherService.update(editingTeacher.value.id, form);
      toast.success("Teacher updated successfully.");
    } else {
      await teacherService.create(form);
      toast.success("Teacher created successfully.");
    }
    await loadTeachers();
    closeModal();
  } catch (error) {
    console.error("Failed to save teacher:", error);
    toast.error("Failed to save teacher.");
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingTeacher.value = null;
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
      :columns="teacherColumns"
      :actions="teacherActions(viewTeacher, editTeacher, confirmDelete)"
      :onCreate="() => (showCreateModal = true)"
      :canCreate="true"
    />

    <CreateOrEditTeacher
      v-if="showCreateModal || editingTeacher"
      :show="true"
      :teacher="editingTeacher"
      @close="closeModal"
      @save="saveTeacher"
    />

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
