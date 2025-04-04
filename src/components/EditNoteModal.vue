<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Note</h3>
      <textarea
        v-model="localText"
        placeholder="Enter your note here"
        rows="4"
        class="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="save"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  initialText?: string
}>()

const emit = defineEmits<{
  (e: 'update', text: string): void
  (e: 'close'): void
}>()

const localText = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      localText.value = props.initialText || ''
    }
  },
)

watch(
  () => props.initialText,
  (newText) => {
    if (props.isOpen) {
      localText.value = newText || ''
    }
  },
)

const save = () => {
  emit('update', localText.value)
  emit('close')
}

const close = () => {
  localText.value = ''
  emit('close')
}
</script>
