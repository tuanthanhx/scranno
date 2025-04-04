<template>
  <header
    class="fixed top-0 left-0 z-[10000] flex justify-between items-center px-5 py-2 w-full min-w-[1520px] h-[60px] bg-white shadow-md"
  >
    <RouterLink to="/" class="w-[220px]">
      <LogoIcon />
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import LogoIcon from '@/components/icons/IconLogo.vue'
</script>

<style scoped></style>
