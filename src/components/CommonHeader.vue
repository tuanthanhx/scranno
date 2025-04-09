<template>
  <header
    class="fixed top-0 left-0 z-[11000] flex justify-between items-center px-5 py-2 w-full min-w-[1520px] h-[60px] bg-white shadow-md"
  >
    <RouterLink to="/" class="w-[220px]">
      <LogoIcon />
    </RouterLink>

    <div class="flex items-center space-x-8">
      <template v-if="route.name === 'CreateBoard'">
        <button
          class="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
          @click="navigateTo('/')"
        >
          Discard
        </button>

        <button
          class="inline-block min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer"
          @click="triggerSave"
        >
          Save
        </button>
      </template>
      <template v-else-if="route.name === 'SingleBoard'">
        <div class="flex items-center space-x-8">
          <div class="text-sm relative group cursor-default">
            Expires in:
            <span class="font-semibold">
              {{ expirationDays }} days
              <span
                class="absolute left-1/2 transform -translate-x-1/2 -top-4.5 mb-2 hidden group-hover:block bg-gray-900/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap"
              >
                {{ expirationTime }}
              </span>
            </span>
          </div>
          <div class="flex items-center gap-2 cursor-pointer" @click="copyToClipboard">
            <div>{{ link }}</div>
            <div class="relative">
              <DocumentDuplicateIcon class="w-5 h-5 text-gray-500 hover:text-gray-700" />
              <div
                v-if="showPopover"
                class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 shadow-lg"
              >
                Copied!
                <div
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-b-gray-800"
                ></div>
              </div>
            </div>
          </div>
          <button
            class="inline-block min-w-[100px] bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer"
          >
            Edit
          </button>
        </div>
      </template>
      <template v-else>
        <button
          class="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
          @click="navigateTo('/login')"
        >
          Log In
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer"
          @click="navigateTo('/signup')"
        >
          Sign Up
        </button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { emitter } from '@/utils/eventBus';
import { useNavigation } from '@/utils/useNavigation';
import LogoIcon from '@/components/icons/IconLogo.vue';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/solid';

const route = useRoute();
const { navigateTo } = useNavigation();

const link = ref('https://scranno.com/snT4GCX'); // @TODO: Dummy
const expirationDate = ref('2025-04-13T10:03:48.227Z'); // @TODO: Dummy
const showPopover = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.value);
    showPopover.value = true;
    setTimeout(() => {
      showPopover.value = false;
    }, 1000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Computed property for expiration days
const expirationDays = computed(() => {
  const now = new Date();
  const expiry = new Date(expirationDate.value);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Computed property for formatted expiration date
const expirationTime = computed(() => {
  const expiry = new Date(expirationDate.value);
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

const triggerSave = () => {
  emitter.emit('save');
};
</script>

<style scoped></style>
