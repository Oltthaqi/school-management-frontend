import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/students",
    name: "Students",
    component: () => import("../views/StudentsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/teachers",
    name: "Teachers",
    component: () => import("../views/TeachersView.vue"),
    meta: { requiresAuth: true, roles: ["ROLE_ADMIN"] },
  },
  {
    path: "/courses",
    name: "Courses",
    component: () => import("../views/CoursesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/enrollments",
    name: "Enrollments",
    component: () => import("../views/EnrollmentsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/grades",
    name: "Grades",
    component: () => import("../views/GradesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/dashboard");
  } else if (to.meta.roles && to.meta.roles.length > 0) {
    const userRoles = authStore.user?.roles || [];
    const hasRequiredRole = to.meta.roles.some((role: string) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      next("/dashboard");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
