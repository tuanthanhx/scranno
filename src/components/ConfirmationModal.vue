<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="confirm"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {{ confirmText }}
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const confirm = () => {
  emit('confirm')
  emit('close')
}

const close = () => {
  emit('close')
}
</script>
