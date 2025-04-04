<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Confirm Deletion</h3>
      <p class="mb-4">Are you sure you want to delete this note? This action cannot be undone.</p>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const confirmDelete = () => {
  emit('confirm')
  emit('close')
}

const close = () => {
  emit('close')
}
</script>
