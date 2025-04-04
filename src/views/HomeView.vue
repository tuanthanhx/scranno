<template>
  <main>
    <div class="h-screen flex justify-center items-center">
      <div class="flex w-[600px] flex-col text-center">
        <h1 class="w-[600px] mb-5">
          <LogoIcon />
        </h1>
        <h2 class="mb-8 text-2xl md:text-3xl font-bold text-gray-700">
          Screen Annotation Made Easy
        </h2>
        <RouterLink
          to="/board"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 px-8 rounded-lg text-lg transition duration-300 cursor-pointer"
          @click="createNewBoard"
        >
          Get Started
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import LogoIcon from '@/components/icons/IconLogo.vue'
</script>
