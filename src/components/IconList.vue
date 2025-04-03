<template>
  <div class="flex space-x-3 justify-end items-center">
    <CheckIcon
      class="w-5 h-5 text-white opacity-30 hover:opacity-100 bg-green-500 rounded-md cursor-pointer"
    />
    <XMarkIcon
      class="w-5 h-5 text-white opacity-30 hover:opacity-100 bg-red-800 rounded-md cursor-pointer"
    />
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/solid'
</script>
