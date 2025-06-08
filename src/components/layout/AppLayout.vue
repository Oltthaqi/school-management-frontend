<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              School Management
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              Welcome, {{ authStore.user?.firstName }}
            </span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="mt-8 px-4">
          <ul class="space-y-2">
            <li v-if="authStore.isAdmin">
              <router-link
                to="/dashboard"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Dashboard' }"
              >
                <HomeIcon class="h-5 w-5" />
                Dashboard
              </router-link>
            </li>

            <li v-if="authStore.isAdmin || authStore.isTeacher">
              <router-link
                to="/students"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Students' }"
              >
                <UserGroupIcon class="h-5 w-5" />
                Students
              </router-link>
            </li>

            <li v-if="authStore.isAdmin">
              <router-link
                to="/teachers"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Teachers' }"
              >
                <AcademicCapIcon class="h-5 w-5" />
                Teachers
              </router-link>
            </li>

            <li>
              <router-link
                to="/courses"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Courses' }"
              >
                <BookOpenIcon class="h-5 w-5" />
                Courses
              </router-link>
            </li>

            <li>
              <router-link
                to="/enrollments"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Enrollments' }"
              >
                <ClipboardDocumentListIcon class="h-5 w-5" />
                Enrollments
              </router-link>
            </li>

            <li>
              <router-link
                to="/grades"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Grades' }"
              >
                <ChartBarIcon class="h-5 w-5" />
                Grades
              </router-link>
            </li>

            <!-- <li v-if="authStore.isAdmin">
              <router-link
                to="/admissions"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Admissions' }"
              > -->
            <!-- <DocumentTextIcon class="h-5 w-5" />
                Admissions
              </router-link>
            </li> -->
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.replace({ name: "Login" });
};
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200;
}

.nav-link-active {
  @apply text-blue-600 bg-blue-50 hover:bg-blue-100;
}
</style>
