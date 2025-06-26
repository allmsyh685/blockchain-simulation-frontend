<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6">Register</h1>
        <form @submit.prevent="register">
          <input v-model="name" type="text" placeholder="Name"
            class="w-full mb-4 p-2 border border-gray-300 rounded" required />
          <input v-model="email" type="email" placeholder="Email"
            class="w-full mb-4 p-2 border border-gray-300 rounded" required />
          <input v-model="password" type="password" placeholder="Password"
            class="w-full mb-4 p-2 border border-gray-300 rounded" required />
          <button type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">Register</button>
          <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { authService } from '@/services/auth.service'
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  
  const register = async () => {
    try {
      const response = await authService.register({
        name: name.value,
        email: email.value,
        password: password.value
      })
  
      // simpan token ke localStorage
      localStorage.setItem('token', response.token)
  
      // redirect ke halaman dashboard
      alert('Registration successful! You can now log in.')
      //window.location.href = '/dashboard'
    } catch (err: any) {
      errorMessage.value = err.message || 'Registration failed'
      console.error(err)
    }
  }
  </script>
  