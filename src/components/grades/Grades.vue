<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import ResourceTable from "../ui/ResourceTable.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import CreateGradeModal from "./CreateGradeModal.vue";
import EditGradeModal from "./EditGradeModal.vue";
import { useAuthStore } from "../../stores/auth";
import { gradeService } from "../../services/gradeService";
import type { Grade } from "../../types";
import { letterGrades, gradeColumns } from "../../utils/constants";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();

const grades = ref<Grade[]>([]);
const editingGrade = ref<Grade | null>(null);
const viewingGrade = ref<Grade | null>(null);
const gradeToDelete = ref<Grade | null>(null);
const creatingEnrollmentId = ref<number | null>(null);

const form = reactive({
  gradeValue: 0,
  letterGrade: "",
  comments: "",
});

const loadGrades = async () => {
  try {
    grades.value = await gradeService.getAll();
  } catch (error) {
    console.error("Failed to load grades:", error);
  }
};

const viewGrade = async (grade: Grade) => {
  try {
    viewingGrade.value = await gradeService.getById(grade.id);
  } catch (error) {
    console.error("Failed to load grade details:", error);
  }
};

const editGrade = (grade: Grade) => {
  editingGrade.value = grade;
  Object.assign(form, {
    gradeValue: grade.gradeValue,
    letterGrade: grade.letterGrade || "",
    comments: grade.comments || "",
  });
};

const confirmDelete = (grade: Grade) => {
  gradeToDelete.value = grade;
};

const deleteGrade = async () => {
  if (!gradeToDelete.value) return;

  try {
    await gradeService.delete(gradeToDelete.value.id);
    await loadGrades();
    gradeToDelete.value = null;
    toast.success("Grade deleted successfully.");
  } catch (error) {
    console.error("Failed to delete grade:", error);
    toast.error("Failed to delete grade.");
  }
};

const closeEditModal = () => {
  editingGrade.value = null;
  Object.assign(form, { gradeValue: 0, letterGrade: "", comments: "" });
};

const closeCreateModal = () => {
  creatingEnrollmentId.value = null;
  Object.assign(form, { gradeValue: 0, letterGrade: "", comments: "" });
};

onMounted(() => {
  loadGrades();
});

const actions = [
  { label: "View", onClick: viewGrade },
  {
    label: "Edit",
    onClick: editGrade,
    variant: "primary" as const,
    show: () => authStore.isTeacher || authStore.isAdmin,
  },
  {
    label: "Delete",
    onClick: confirmDelete,
    variant: "danger" as const,
    show: () => authStore.isAdmin,
  },
];
</script>

<template>
  <AppLayout>
    <ResourceTable
      title="Grades"
      :items="grades"
      :columns="gradeColumns"
      :actions="actions"
      :onCreate="() => (creatingEnrollmentId = 1)"
      :canCreate="authStore.isTeacher"
    />

    <CreateGradeModal
      v-if="creatingEnrollmentId"
      :enrollment-id="creatingEnrollmentId"
      :letter-grades="letterGrades"
      v-model:form="form"
      @close="closeCreateModal"
      @refresh="loadGrades"
    />

    <EditGradeModal
      v-if="editingGrade"
      :grade="editingGrade"
      :letter-grades="letterGrades"
      v-model:form="form"
      @close="closeEditModal"
      @refresh="loadGrades"
    />

    <DetailModal
      v-if="viewingGrade"
      :title="`Grade Details`"
      @close="viewingGrade = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium">Student</label>
          <p>{{ viewingGrade.enrollment?.student.user.fullName }}</p>
        </div>
        <div>
          <label class="text-sm font-medium">Course</label>
          <p>{{ viewingGrade.enrollment?.course.name }}</p>
        </div>
        <div>
          <label class="text-sm font-medium">Grade Value</label>
          <p>{{ viewingGrade.gradeValue }}</p>
        </div>
        <div>
          <label class="text-sm font-medium">Letter Grade</label>
          <p>{{ viewingGrade.letterGrade }}</p>
        </div>
        <div>
          <label class="text-sm font-medium">Graded At</label>
          <p>{{ new Date(viewingGrade.gradedAt).toLocaleDateString() }}</p>
        </div>
        <div class="col-span-2">
          <label class="text-sm font-medium">Comments</label>
          <p>{{ viewingGrade.comments || "No comments" }}</p>
        </div>
      </div>
    </DetailModal>

    <ConfirmationModal
      v-if="gradeToDelete"
      title="Delete Grade"
      message="Are you sure you want to delete this grade? This action cannot be undone."
      confirm-text="Delete"
      @confirm="deleteGrade"
      @cancel="gradeToDelete = null"
    />
  </AppLayout>
</template>
