<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-900">404</h1>
        <h2 class="mt-4 text-2xl font-semibold text-gray-700">Page not found</h2>
        <p class="mt-2 text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div class="mt-6">
          <router-link
            to="/dashboard"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go back home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>