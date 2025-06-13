<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import { useAuthStore } from "../../stores/auth";
import { enrollmentService } from "../../services/enrollmentService";
import { studentService } from "../../services/studentService";
import { courseService } from "../../services/courseService";
import type { Enrollment, Student, Course } from "../../types";
import { toast } from "vue3-toastify";
import ResourceTable from "../ui/ResourceTable.vue";
import CreateEnrollmentModal from "./CreateEnrollmentModal.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import { enrollmentColumns } from "../../utils/constants";

const authStore = useAuthStore();
const enrollments = ref<Enrollment[]>([]);
const students = ref<Student[]>([]);
const courses = ref<Course[]>([]);
const showCreateModal = ref(false);
const viewingEnrollment = ref<Enrollment | null>(null);
const enrollmentToDelete = ref<Enrollment | null>(null);

const loadEnrollments = async () => {
  try {
    enrollments.value = await enrollmentService.getAll();
  } catch (error) {
    console.error("Failed to load enrollments:", error);
  }
};

const loadStudents = async () => {
  try {
    students.value = await studentService.getAll();
  } catch (error) {
    console.error("Failed to load students:", error);
  }
};

const loadCourses = async () => {
  try {
    courses.value = await courseService.getAll();
  } catch (error) {
    console.error("Failed to load courses:", error);
  }
};

const viewEnrollment = (enrollment: Enrollment) => {
  viewingEnrollment.value = enrollment;
};

const gradeEnrollment = (enrollment: Enrollment) => {
  console.log("Grade enrollment:", enrollment);
};

const confirmDelete = (enrollment: Enrollment) => {
  enrollmentToDelete.value = enrollment;
};

const deleteEnrollment = async () => {
  if (!enrollmentToDelete.value) return;
  try {
    await enrollmentService.delete(enrollmentToDelete.value.id);
    await loadEnrollments();
    enrollmentToDelete.value = null;
    toast.success("Enrollment deleted successfully.");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to delete enrollment."
    );
  }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const getStatusBadge = (status: string) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  switch (status.toLowerCase()) {
    case "active":
      return `${base} bg-green-100 text-green-800`;
    case "completed":
      return `${base} bg-blue-100 text-blue-800`;
    case "dropped":
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
};

onMounted(() => {
  loadEnrollments();
  loadStudents();
  loadCourses();
});

const actions = [
  { label: "View", onClick: viewEnrollment },
  {
    label: "Grade",
    onClick: gradeEnrollment,
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
      title="Enrollments"
      :items="enrollments"
      :columns="enrollmentColumns"
      :actions="actions"
      :onCreate="() => (showCreateModal = true)"
      :canCreate="authStore.isAdmin"
    />

    <CreateEnrollmentModal
      :show="showCreateModal"
      :students="students"
      :courses="courses"
      @close="showCreateModal = false"
      @saved="loadEnrollments"
    />

    <DetailModal
      v-if="viewingEnrollment"
      :title="`Enrollment Details`"
      @close="viewingEnrollment = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Student</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.student.firstName }}
            {{ viewingEnrollment.student.lastName }}
            ({{ viewingEnrollment.student.studentId }})
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Course</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.course.courseCode }} -
            {{ viewingEnrollment.course.name }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Enrolled Date</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ formatDate(viewingEnrollment.enrolledAt) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.status }}
          </p>
        </div>
        <div v-if="viewingEnrollment.grade" class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Grade</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.grade.letterGrade }} ({{
              viewingEnrollment.grade.gradeValue
            }})
          </p>
        </div>
      </div>
    </DetailModal>

    <ConfirmationModal
      v-if="enrollmentToDelete"
      title="Delete Enrollment"
      message="Are you sure you want to delete this enrollment? This action cannot be undone."
      confirm-text="Delete"
      @confirm="deleteEnrollment"
      @cancel="enrollmentToDelete = null"
    />
  </AppLayout>
</template>
