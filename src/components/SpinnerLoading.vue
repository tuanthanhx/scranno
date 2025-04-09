<template>
  <div
    v-if="isVisible"
    class="loading-overlay fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-[100000]"
  >
    <div
      class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  isVisible: boolean;
}>();

</script>
