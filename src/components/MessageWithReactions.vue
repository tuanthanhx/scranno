<template>
  <div class="relative group">
    <div>
      {{ message || '&nbsp;' }}
    </div>
    <div
      class="absolute top-0 -right-4 mt-[-10px] opacity-0 group-hover:opacity-100 transition-opacity"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <button
        class="text-xl hover:scale-125 transition-transform"
        title="Click to add"
        @click="toggleReaction(EMOJI_DEFAULT)"
      >
        {{ EMOJI_DEFAULT }}
      </button>
      <div
        v-if="showPicker"
        class="absolute right-0 mt-2 w-64 max-h-40 bg-white shadow-lg rounded-lg p-2 overflow-y-auto z-10"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="emoji in EMOJI_LIST"
            :key="emoji"
            :class="[
              'text-lg transition-transform hover:scale-125 hover:opacity-100 hover:grayscale-0',
              reactions.has(emoji) ? 'opacity-100 grayscale-0' : 'opacity-25 grayscale',
            ]"
            :title="reactions.has(emoji) ? 'Click to remove' : 'Click to add'"
            @click="toggleReaction(emoji)"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-8">
      <button
        v-for="emoji in reactions"
        :key="emoji"
        class="text-lg"
        title="Click to remove"
        @click="toggleReaction(emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  message: string | null | undefined;
  initialReactions?: string[];
}>();

const emit = defineEmits<{
  (e: 'reaction-changed', emoji: string, isAdded: boolean): void;
}>();

const EMOJI_DEFAULT = '👍';
const EMOJI_LIST = ['👍', '🔧', '🛠️', '✅', '👀', '🚀', '❌', '🤔', '✋', '📅', '📌', '🔥', '💡', '❤️'];

const showPicker = ref(false);
const reactions = ref(new Set<string>());

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const toggleReaction = (emoji: string) => {
  if (reactions.value?.has(emoji)) {
    reactions.value.delete(emoji);
    emit('reaction-changed', emoji, false);
  } else {
    reactions.value.add(emoji);
    emit('reaction-changed', emoji, true);
  }
  reactions.value = new Set(reactions.value);
  showPicker.value = false;
};

const handleMouseEnter = () => {
  if (timeoutId) clearTimeout(timeoutId);
  showPicker.value = true;
};

const handleMouseLeave = () => {
  timeoutId = setTimeout(() => {
    showPicker.value = false;
  }, 300);
};

onMounted(() => {
  if (props.initialReactions && props.initialReactions.length > 0) {
    props.initialReactions.forEach((emoji) => reactions.value.add(emoji));
    reactions.value = new Set(reactions.value);
  }
});

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<style scoped></style>
