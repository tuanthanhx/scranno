<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Note</h3>
        <textarea
          ref="textArea"
          v-model="localText"
          placeholder="Enter your note here"
          rows="4"
          class="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Color</h3>
        <div class="flex gap-3">
          <div
            v-for="color in colors"
            :key="color"
            @click="selectColor(color)"
            :style="{ backgroundColor: color }"
            class="w-6 h-6 cursor-pointer border-2"
            :class="{
              'border-black': selectedColor === color,
              'border-gray-200': selectedColor !== color,
            }"
          ></div>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="save"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Save
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
        >
          Discard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  isOpen: boolean
  initialText?: string
  initialColor?: string
}>()

const emit = defineEmits<{
  (e: 'update', text: string, color: string): void
  (e: 'close'): void
}>()

const localText = ref('')
const selectedColor = ref('#ff0000')
const textArea = ref(null);

const colors = [
  '#ff0000', // Red
  '#ff8000', // Orange
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#0000ff', // Blue
  '#800080', // Purple
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
]

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      localText.value = props.initialText || ''
      selectedColor.value = props.initialColor || '#ff0000'
      nextTick(() => {
        textArea.value?.focus();
      });
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

watch(
  () => props.initialColor,
  (newColor) => {
    if (props.isOpen) {
      selectedColor.value = newColor || '#ff0000'
    }
  },
)

const selectColor = (color: string) => {
  selectedColor.value = color
}

const save = () => {
  emit('update', localText.value.trim(), selectedColor.value)
  emit('close')
}

const close = () => {
  localText.value = ''
  selectedColor.value = '#ff0000'
  emit('close')
}
</script>
