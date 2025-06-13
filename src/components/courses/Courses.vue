<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import Card from "../ui/Card.vue";
import DetailModal from "../ui/DetailModal.vue";
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import { useAuthStore } from "../../stores/auth";
import { courseService } from "../../services/courseService";
import { teacherService } from "../../services/teacherService";
import type { Course, Teacher } from "../../types";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();

const courses = ref<Course[]>([]);
const teachers = ref<Teacher[]>([]);
const showCreateModal = ref(false);
const editingCourse = ref<Course | null>(null);
const viewingCourse = ref<Course | null>(null);
const courseToDelete = ref<Course | null>(null);

const form = reactive({
  courseCode: "",
  name: "",
  description: "",
  creditHours: 3,
  teacherId: "",
});

const loadCourses = async () => {
  try {
    courses.value = await courseService.getAll();
  } catch (error) {
    console.error("Failed to load courses:", error);
    toast.error("Failed to load courses.");
  }
};

const loadTeachers = async () => {
  try {
    teachers.value = await teacherService.getAll();
  } catch (error) {
    console.error("Failed to load teachers:", error);
    toast.error("Failed to load teachers.");
  }
};

const viewCourse = async (course: Course) => {
  try {
    viewingCourse.value = await courseService.getById(course.id);
  } catch (error) {
    console.error("Failed to load course details:", error);
    toast.error("Failed to load course details.");
  }
};

const editCourse = (course: Course) => {
  editingCourse.value = course;
  Object.assign(form, {
    courseCode: course.courseCode,
    name: course.name,
    description: course.description || "",
    creditHours: course.creditHours || 3,
    teacherId: course.teacher.id.toString(),
  });
};

const confirmDelete = (course: Course) => {
  courseToDelete.value = course;
};

const deleteCourse = async () => {
  if (!courseToDelete.value) return;

  try {
    await courseService.delete(courseToDelete.value.id);
    await loadCourses();
    courseToDelete.value = null;
    toast.success("Course deleted successfully.");
  } catch (error) {
    console.error("Failed to delete course:", error);
    toast.error("Failed to delete course.");
  }
};

const saveCourse = async () => {
  try {
    const courseData = {
      ...form,
      teacherId: parseInt(form.teacherId),
    };

    if (editingCourse.value) {
      await courseService.update(editingCourse.value.id, courseData);
      toast.success("Course updated successfully.");
    } else {
      await courseService.create(courseData);
      toast.success("Course created successfully.");
    }

    await loadCourses();
    closeModal();
  } catch (error) {
    console.error("Failed to save course:", error);
    toast.error("Failed to save course.");
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingCourse.value = null;
  Object.assign(form, {
    courseCode: "",
    name: "",
    description: "",
    creditHours: 3,
    teacherId: "",
  });
};

const getInitials = (teacher: Course["teacher"]) => {
  return `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`;
};

onMounted(() => {
  loadCourses();
  loadTeachers();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Courses</h1>
        <Button v-if="authStore.isAdmin" @click="showCreateModal = true">
          Add Course
        </Button>
      </div>

      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="course in courses" :key="course.id" hover>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ course.courseCode }}
              </h3>
              <p class="text-sm text-gray-600">{{ course.name }}</p>
            </div>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ course.creditHours || 0 }} Credits
            </span>
          </div>

          <p class="text-gray-600 text-sm mb-4">
            {{ course.description || "No description available" }}
          </p>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div
                class="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <span class="text-xs font-medium text-gray-600">
                  {{ getInitials(course.teacher) }}
                </span>
              </div>
              <span class="text-sm text-gray-600">
                {{ course.teacher.firstName }} {{ course.teacher.lastName }}
              </span>
            </div>
            <div class="flex space-x-2">
              <Button variant="secondary" size="sm" @click="viewCourse(course)">
                View
              </Button>
              <Button
                v-if="authStore.isAdmin"
                variant="primary"
                size="sm"
                @click="editCourse(course)"
              >
                Edit
              </Button>
              <Button
                v-if="authStore.isAdmin"
                variant="danger"
                size="sm"
                @click="confirmDelete(course)"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal || editingCourse" @close="closeModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingCourse ? "Edit Course" : "Add New Course" }}
        </h3>

        <form @submit.prevent="saveCourse" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Course Code</label>
              <input
                v-model="form.courseCode"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">Credit Hours</label>
              <input
                v-model.number="form.creditHours"
                type="number"
                min="1"
                max="6"
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">Course Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="form-input"
            ></textarea>
          </div>

          <div>
            <label class="form-label">Teacher</label>
            <select v-model="form.teacherId" required class="form-input">
              <option value="">Select a teacher</option>
              <option
                v-for="teacher in teachers"
                :key="teacher.id"
                :value="teacher.id"
              >
                {{ teacher.firstName }} {{ teacher.lastName }} ({{
                  teacher.department
                }})
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="closeModal"> Cancel </Button>
            <Button type="submit">
              {{ editingCourse ? "Update" : "Create" }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Detail Modal -->
    <DetailModal
      v-if="viewingCourse"
      :title="`Course Details - ${viewingCourse.courseCode}`"
      @close="viewingCourse = null"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Course Code</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingCourse.courseCode }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Credit Hours</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingCourse.creditHours || "N/A" }}
          </p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Course Name</label
          >
          <p class="mt-1 text-sm text-gray-900">{{ viewingCourse.name }}</p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingCourse.description || "N/A" }}
          </p>
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Teacher</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ viewingCourse.teacher.firstName }}
            {{ viewingCourse.teacher.lastName }} ({{
              viewingCourse.teacher.department
            }})
          </p>
        </div>
      </div>
    </DetailModal>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="courseToDelete"
      title="Delete Course"
      message="Are you sure you want to delete this course? This action cannot be undone."
      confirm-text="Delete"
      @confirm="deleteCourse"
      @cancel="courseToDelete = null"
    />
  </AppLayout>
</template>
