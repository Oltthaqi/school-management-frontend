<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import Card from "../ui/Card.vue";
import { dashboardService } from "../../services/dashboardService";
import { enrollmentService } from "../../services/enrollmentService";
import { gradeService } from "../../services/gradeService";
import { courseService } from "../../services/courseService";
import { useAuthStore } from "../../stores/auth";
import type { Enrollment, Grade } from "../../types";
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const totalStudents = ref<number | null>(null);
const totalTeachers = ref<number | null>(null);
const totalCourses = ref<number | null>(null);
const totalEnrollments = ref<number | null>(null);
const recentEnrollments = ref<Enrollment[]>([]);
const recentGrades = ref<Grade[]>([]);

const loadDashboardData = async () => {
  try {
    // Load stats
    totalStudents.value = await dashboardService.getTotalStudents();
    totalTeachers.value = await dashboardService.getTotalTeachers();

    const courses = await courseService.getAll();
    totalCourses.value = courses.length;

    const enrollments = await enrollmentService.getAll();
    totalEnrollments.value = enrollments.length;
    recentEnrollments.value = enrollments
      .sort(
        (a, b) =>
          new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
      )
      .slice(0, 5);

    const grades = await gradeService.getAll();
    recentGrades.value = grades
      .sort(
        (a, b) =>
          new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime()
      )
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
};

const getInitials = (student: Enrollment["student"]) => {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
};

const getGradeInitials = (grade: Grade) => {
  // This would need to be updated based on actual grade structure
  return "GR";
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString();
};

onMounted(() => {
  loadDashboardData();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">
          Welcome back, {{ authStore.user?.firstName }}!
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Students</p>
              <span
                class="text-2xl font-semibold text-gray-900"
                v-if="totalStudents !== null"
                >{{ totalStudents.toLocaleString() }}</span
              >
            </div>
            <div
              class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <UserGroupIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Teachers</p>
              <span
                class="text-2xl font-semibold text-gray-900"
                v-if="totalTeachers !== null"
                >{{ totalTeachers.toLocaleString() }}</span
              >
            </div>
            <div
              class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <AcademicCapIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Courses</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ totalCourses || 0 }}
              </p>
            </div>
            <div
              class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <BookOpenIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Enrollments</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ totalEnrollments || 0 }}
              </p>
            </div>
            <div
              class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center"
            >
              <ClipboardDocumentListIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Enrollments Card -->
        <Card>
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">
              Recent Enrollments
            </h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="enrollment in recentEnrollments"
              :key="enrollment.id"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <span class="text-xs font-medium text-gray-600">
                    {{ getInitials(enrollment.student) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ enrollment.student.firstName }}
                    {{ enrollment.student.lastName }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ enrollment.course.name }}
                  </p>
                </div>
              </div>
              <span class="text-xs text-gray-500">
                {{ formatRelativeTime(enrollment.enrolledAt) }}
              </span>
            </div>
          </div>
        </Card>

        <!-- Recent Grades Card -->
        <Card>
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">Recent Grades</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="grade in recentGrades"
              :key="grade.id"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <span class="text-xs font-medium text-gray-600">
                    {{ getGradeInitials(grade) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Grade Updated</p>
                  <p class="text-xs text-gray-500">
                    {{ grade.enrollmentId }}
                  </p>
                </div>
              </div>
              <span class="text-sm font-semibold text-green-600">
                {{ grade.letterGrade }}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>
