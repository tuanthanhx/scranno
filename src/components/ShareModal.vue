<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <div>
        <h3>SHARE</h3>
        <p>https://example.com/abcd1234</p>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};
</script>
