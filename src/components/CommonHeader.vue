<template>
  <header
    class="fixed top-0 left-0 z-[10000] flex justify-between items-center px-5 py-2 w-full min-w-[1520px] h-[60px] bg-white shadow-md"
  >
    <RouterLink to="/" class="w-[220px]">
      <LogoIcon />
    </RouterLink>

    <div class="flex items-center space-x-8">
      <template v-if="route.name === 'CreateBoard'">
        <template v-if="isEditorMode">
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
        <template v-else>
          <div class="flex items-center gap-2 cursor-pointer" @click="copyToClipboard">
            <div>{{ link }}</div>
            <DocumentDuplicateIcon class="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </div>
          <button
            class="inline-block min-w-[100px] bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer"
            @click="triggerEdit"
          >
            Edit
          </button>
        </template>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigation } from '@/utils/useNavigation';
import LogoIcon from '@/components/icons/IconLogo.vue';
import { DocumentDuplicateIcon } from '@heroicons/vue/24/solid';
import { emitter } from '@/utils/eventBus';

const route = useRoute();
const { navigateTo } = useNavigation();

const isEditorMode = ref(true);

const link = ref('https://scranno.com/snT4GCX'); // @TODO: Dummy

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.value);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const triggerSave = () => {
  emitter.emit('save');
};

const triggerEdit = () => {
  emitter.emit('edit');
};

onMounted(() => {
  emitter.on('editorModeChange', (value: unknown) => {
    isEditorMode.value = value as boolean;
  });
});

onUnmounted(() => {
  emitter.off('editorModeChange');
});
</script>

<style scoped></style>
