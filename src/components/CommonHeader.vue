<template>
  <header
    class="fixed top-0 left-0 z-[10000] flex justify-between items-center px-5 py-2 w-full min-w-[1520px] h-[60px] bg-white shadow-md"
  >
    <RouterLink to="/" class="w-[220px]">
      <LogoIcon />
    </RouterLink>

    <div class="flex items-center space-x-8">
      <template v-if="route.name === 'CreateBoard'">
        <button
          class="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
          @click="navigateTo('/')"
        >
          Discard
        </button>
        <button
          class="inline-block min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer"
        >
          Save
        </button>
      </template>
      <template v-else>
        <button
          class="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
          @click="navigateTo('/login')"
        >
          Log In
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer"
          @click="navigateTo('/signup')"
        >
          Sign Up
        </button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useNavigation } from '@/utils/useNavigation'
import LogoIcon from '@/components/icons/IconLogo.vue'

const route = useRoute()
const { navigateTo } = useNavigation()
</script>

<style scoped></style>
