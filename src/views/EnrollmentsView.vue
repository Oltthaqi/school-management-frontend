<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Enrollments</h1>
        <Button
          v-if="authStore.isAdmin"
          @click="showCreateModal = true"
        >
          Add Enrollment
        </Button>
      </div>

      <!-- Enrollments Table -->
      <Card>
        <Table>
          <template #header>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </template>
          
          <tr v-for="enrollment in enrollments" :key="enrollment.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <p class="font-medium">{{ enrollment.student.firstName }} {{ enrollment.student.lastName }}</p>
                <p class="text-sm text-gray-500">{{ enrollment.student.studentId }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <p class="font-medium">{{ enrollment.course.courseCode }}</p>
                <p class="text-sm text-gray-500">{{ enrollment.course.name }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(enrollment.enrolledAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusBadgeClass(enrollment.status)">
                {{ enrollment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="enrollment.grade" class="font-medium text-green-600">
                {{ enrollment.grade.letterGrade }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  @click="viewEnrollment(enrollment)"
                >
                  View
                </Button>
                <Button
                  v-if="authStore.isTeacher || authStore.isAdmin"
                  variant="success"
                  size="sm"
                  @click="gradeEnrollment(enrollment)"
                >
                  Grade
                </Button>
                <Button
                  v-if="authStore.isAdmin"
                  variant="danger"
                  size="sm"
                  @click="confirmDelete(enrollment)"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        </Table>
      </Card>
    </div>

    <!-- Create Modal -->
    <Modal v-if="showCreateModal" @close="closeCreateModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Enrollment</h3>

        <form @submit.prevent="saveEnrollment" class="space-y-4">
          <div>
            <label class="form-label">Student</label>
            <select
              v-model="form.studentId"
              required
              class="form-input"
            >
              <option value="">Select a student</option>
              <option
                v-for="student in students"
                :key="student.id"
                :value="student.id"
              >
                {{ student.firstName }} {{ student.lastName }} ({{ student.studentId }})
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">Course</label>
            <select
              v-model="form.courseId"
              required
              class="form-input"
            >
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
            <Button variant="secondary" @click="closeCreateModal">
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Detail Modal -->
    <DetailModal
      v-if="viewingEnrollment"
      :title="`Enrollment Details`"
      @close="viewingEnrollment = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Student</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.student.firstName }} {{ viewingEnrollment.student.lastName }}
            ({{ viewingEnrollment.student.studentId }})
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Course</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.course.courseCode }} - {{ viewingEnrollment.course.name }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Enrolled Date</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(viewingEnrollment.enrolledAt) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <p class="mt-1 text-sm text-gray-900">{{ viewingEnrollment.status }}</p>
        </div>
        <div v-if="viewingEnrollment.grade" class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Grade</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingEnrollment.grade.letterGrade }} ({{ viewingEnrollment.grade.gradeValue }})
          </p>
        </div>
      </div>
    </DetailModal>

    <!-- Confirmation Modal -->
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
import { enrollmentService } from "../services/enrollmentService";
import { studentService } from "../services/studentService";
import { courseService } from "../services/courseService";
import type { Enrollment, Student, Course } from "../types";

const authStore = useAuthStore();

const enrollments = ref<Enrollment[]>([]);
const students = ref<Student[]>([]);
const courses = ref<Course[]>([]);
const showCreateModal = ref(false);
const viewingEnrollment = ref<Enrollment | null>(null);
const enrollmentToDelete = ref<Enrollment | null>(null);

const form = reactive({
  studentId: "",
  courseId: "",
});

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

const viewEnrollment = async (enrollment: Enrollment) => {
  try {
    viewingEnrollment.value = await enrollmentService.getById(enrollment.id);
  } catch (error) {
    console.error("Failed to load enrollment details:", error);
  }
};

const gradeEnrollment = (enrollment: Enrollment) => {
  // TODO: Implement grade modal
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
  } catch (error) {
    console.error("Failed to delete enrollment:", error);
  }
};

const saveEnrollment = async () => {
  try {
    const enrollmentData = {
      studentId: parseInt(form.studentId),
      courseId: parseInt(form.courseId),
    };
    
    await enrollmentService.create(enrollmentData);
    await loadEnrollments();
    closeCreateModal();
  } catch (error) {
    console.error("Failed to save enrollment:", error);
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  Object.assign(form, {
    studentId: "",
    courseId: "",
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getStatusBadgeClass = (status: string) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  switch (status.toLowerCase()) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'completed':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'dropped':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

onMounted(() => {
  loadEnrollments();
  loadStudents();
  loadCourses();
});
</script>