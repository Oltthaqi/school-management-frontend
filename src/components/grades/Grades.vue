<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import Card from "../ui/Card.vue";
import Table from "../ui/Table.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import { useAuthStore } from "../../stores/auth";
import { gradeService } from "../../services/gradeService";
import type { Grade } from "../../types";

const authStore = useAuthStore();

const grades = ref<Grade[]>([]);
const editingGrade = ref<Grade | null>(null);
const viewingGrade = ref<Grade | null>(null);
const gradeToDelete = ref<Grade | null>(null);
const showCreateModal = ref(false);

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
  } catch (error) {
    console.error("Failed to delete grade:", error);
  }
};

const saveGrade = async () => {
  if (!editingGrade.value) return;

  try {
    await gradeService.update(editingGrade.value.id, form);
    await loadGrades();
    closeEditModal();
  } catch (error) {
    console.error("Failed to save grade:", error);
  }
};

const closeEditModal = () => {
  editingGrade.value = null;
  Object.assign(form, {
    gradeValue: 0,
    letterGrade: "",
    comments: "",
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getGradeBadgeClass = (letterGrade?: string) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  if (!letterGrade) return `${baseClasses} bg-gray-100 text-gray-800`;

  if (letterGrade.startsWith("A")) {
    return `${baseClasses} bg-green-100 text-green-800`;
  } else if (letterGrade.startsWith("B")) {
    return `${baseClasses} bg-blue-100 text-blue-800`;
  } else if (letterGrade.startsWith("C")) {
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  } else if (letterGrade.startsWith("D")) {
    return `${baseClasses} bg-orange-100 text-orange-800`;
  } else {
    return `${baseClasses} bg-red-100 text-red-800`;
  }
};

// Helper functions for displaying student/course info
// These would need to be updated based on actual API response structure
const getStudentName = (grade: Grade) => {
  // This assumes the grade object includes enrollment data with student info
  return "Student Name"; // Replace with actual data access
};

const getStudentId = (grade: Grade) => {
  return "STU001"; // Replace with actual data access
};

const getCourseName = (grade: Grade) => {
  return "Course Name"; // Replace with actual data access
};

const getCourseCode = (grade: Grade) => {
  return "CS101"; // Replace with actual data access
};

onMounted(() => {
  loadGrades();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Grades</h1>
        <Button v-if="authStore.isTeacher" @click="showCreateModal = true">
          Add Grade
        </Button>
      </div>

      <!-- Grades Table -->
      <Card>
        <Table>
          <template #header>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Student
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Course
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Grade
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Letter Grade
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Graded Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Comments
            </th>
            <th
              v-if="authStore.isTeacher || authStore.isAdmin"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </template>

          <tr v-for="grade in grades" :key="grade.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <p class="font-medium">{{ getStudentName(grade) }}</p>
                <p class="text-sm text-gray-500">{{ getStudentId(grade) }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <p class="font-medium">{{ getCourseName(grade) }}</p>
                <p class="text-sm text-gray-500">{{ getCourseCode(grade) }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span class="font-semibold text-green-600">{{
                grade.gradeValue
              }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getGradeBadgeClass(grade.letterGrade)">
                {{ grade.letterGrade }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(grade.gradedAt) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
              {{ grade.comments || "-" }}
            </td>
            <td
              v-if="authStore.isTeacher || authStore.isAdmin"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <div class="flex space-x-2">
                <Button variant="secondary" size="sm" @click="viewGrade(grade)">
                  View
                </Button>
                <Button variant="primary" size="sm" @click="editGrade(grade)">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  @click="confirmDelete(grade)"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        </Table>
      </Card>
    </div>

    <!-- Edit Modal -->
    <Modal v-if="editingGrade" @close="closeEditModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Grade</h3>

        <form @submit.prevent="saveGrade" class="space-y-4">
          <div>
            <label class="form-label">Grade Value</label>
            <input
              v-model.number="form.gradeValue"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">Letter Grade</label>
            <select v-model="form.letterGrade" required class="form-input">
              <option value="">Select letter grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D+">D+</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>

          <div>
            <label class="form-label">Comments</label>
            <textarea
              v-model="form.comments"
              rows="3"
              class="form-input"
              placeholder="Optional comments about the grade..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="closeEditModal">
              Cancel
            </Button>
            <Button type="submit"> Update Grade </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Detail Modal -->
    <DetailModal
      v-if="viewingGrade"
      :title="`Grade Details`"
      @close="viewingGrade = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Student</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ getStudentName(viewingGrade) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Course</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ getCourseName(viewingGrade) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Grade Value</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingGrade.gradeValue }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Letter Grade</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingGrade.letterGrade }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Graded Date</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ formatDate(viewingGrade.gradedAt) }}
          </p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Comments</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingGrade.comments || "No comments" }}
          </p>
        </div>
      </div>
    </DetailModal>

    <!-- Confirmation Modal -->
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
