<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Check if user is already logged in on app startup
  authStore.checkAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>