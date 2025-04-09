<template>
  <div
    v-if="isVisible"
    :class="[
      'absolute bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 shadow-lg z-10',
      positionClass,
    ]"
    aria-live="polite"
  >
    {{ message }}
    <div :class="['absolute border-6 border-transparent', arrowClass]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  message?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  duration?: number;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
}>();

const isVisible = ref(true);

const positionClass = computed(() => {
  const pos = props.position || 'top';
  return {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  }[pos];
});

const arrowClass = computed(() => {
  const pos = props.position || 'top';
  return {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800',
  }[pos];
});

onMounted(() => {
  const timeoutDuration = props.duration || 1000;
  setTimeout(() => {
    isVisible.value = false;
    emit('hide');
  }, timeoutDuration);
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
