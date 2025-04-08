<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <form @submit.prevent="handleSave" ref="formRef">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Board Name </label>
          <input
            ref="inputBoardName"
            v-model="localBoardName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter board name"
            required
          />
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-4">Storage Duration</h3>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Storage Duration </label>
          <select
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="7">7 days</option>
            <option value="30" disabled>30 days (Premium only)</option>
            <option value="365" disabled>365 days (Premium only)</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">
            Longer storage durations available with Premium plan
          </p>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password <span class="text-gray-500">(Premium only)</span>
          </label>
          <input
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            autocomplete="off"
            placeholder="Available with Premium plan"
            disabled
          />
          <p class="mt-1 text-sm text-gray-500">Password protection is a Premium feature</p>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="handleSave"
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
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', title: string): void;
  (e: 'close'): void;
}>();

const localBoardName = ref('');
const inputBoardName = ref<HTMLTextAreaElement | null>(null);
const formRef = ref<HTMLFormElement | null>(null);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        inputBoardName.value?.focus();
      });
    }
  },
);

const handleSave = () => {
  if (localBoardName.value.trim() === '') {
    alert('Please enter a board name');
    return;
  }
  save();
};

const save = () => {
  emit('save', localBoardName.value.trim());
  emit('close');
};

const close = () => {
  if (formRef.value) {
    formRef.value.reset();
  }
  localBoardName.value = '';
  emit('close');
};
</script>
