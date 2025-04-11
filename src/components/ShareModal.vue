<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-20000">
    <div class="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl relative">
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        title="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Heading -->
      <h3 class="text-xl font-bold text-gray-800 mb-4">Ready to Share</h3>

      <!-- Share Section -->
      <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <input
          type="text"
          :value="link"
          readonly
          class="flex-1 p-2 bg-transparent border-none focus:outline-none text-gray-700"
        />
        <div class="relative">
          <button
            @click="copyToClipboard"
            class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
            title="Copy to clipboard"
          >
            <span class="text-sm">Copy</span>
          </button>
          <PopOver
            v-if="showPopover"
            message="Copied!"
            position="top"
            :duration="1000"
            @hide="showPopover = false"
          />
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg flex items-center gap-2">
        <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>
          This board expires in {{ expirationDays }} day{{ expirationDays > 1 ? 's' : '' }} on
          <span class="font-medium text-gray-800">{{ expirationTime }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PopOver from '@/components/PopOver.vue';

const props = defineProps<{
  isOpen: boolean;
  boardId: string;
  boardTitle: string;
  boardExpiredAt: string;
}>();

const link = ref(`${import.meta.env.VITE_APP_URL}/${props.boardId}`);
const showPopover = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.value);
    showPopover.value = true;
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Computed property for expiration days
const expirationDays = computed(() => {
  const now = new Date();
  const expiry = new Date(props.boardExpiredAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Computed property for formatted expiration date
const expirationTime = computed(() => {
  const expiry = new Date(props.boardExpiredAt);
  return expiry.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};
</script>
