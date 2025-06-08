<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          School Management System
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="form-label">First Name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="form-input"
                placeholder="First Name"
              />
            </div>
            <div>
              <label for="lastName" class="form-label">Last Name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="form-input"
                placeholder="Last Name"
              />
            </div>
          </div>
          
          <div>
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="form-input"
              placeholder="Username"
            />
          </div>
          
          <div>
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="Email address"
            />
          </div>
          
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="Password"
            />
          </div>
          
          <div>
            <label for="role" class="form-label">Role</label>
            <select
              id="role"
              v-model="selectedRole"
              class="form-input"
              required
            >
              <option value="">Select a role</option>
              <option value="ROLE_STUDENT">Student</option>
              <option value="ROLE_TEACHER">Teacher</option>
              <option value="ROLE_ADMIN">Administrator</option>
            </select>
          </div>
        </div>

        <div v-if="authStore.error" class="text-red-600 text-sm text-center">
          {{ authStore.error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full"
          >
            <span v-if="authStore.loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in here
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  roles: [] as string[]
})

const selectedRole = ref('')

const handleRegister = async () => {
  try {
    form.roles = selectedRole.value ? [selectedRole.value] : []
    await authStore.register(form)
    router.push('/dashboard')
  } catch (error) {
    // Error is handled in the store
  }
}
</script>