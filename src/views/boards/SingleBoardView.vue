<template>
  <div
    v-if="isLoading"
    class="loading-overlay fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-[12000]"
  >
    <div
      class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>
  <div class="bg-gray-100 min-h-screen w-full min-w-[1520px] flex">
    <aside class="flex-[300px_0_0] relative z-[9000]">
      <div
        class="sidebar-inner fixed top-0 left-0 w-[300px] pt-[60px] h-screen overflow-x-hidden overflow-y-auto bg-white shadow-md space-y-10"
      >
        <div v-for="(screen, index) in screens" :key="index" :data-index="index">
          <div class="group relative font-bold mb-5 text-center bg-orange-200 leading-5">
            <div class="p-4 cursor-pointer" @click="scrollToElement(screen.id)">
              {{ screen.title || 'Untitled' }}
            </div>
          </div>
          <div class="px-2">
            <ul class="space-y-4">
              <li
                v-for="(selection, sIndex) in screen.selections"
                :key="sIndex"
                :data-sidebar-item-id="selection.id"
                class="flex p-2"
              >
                <div
                  class="w-6 h-6 mr-3 relative top-0.5 flex justify-center content-center items-center rounded-full text-xs font-bold cursor-pointer"
                  :style="getDynamicStyles(selection.color || '#ff0000')"
                  @click="scrollToElement(selection.id)"
                >
                  {{ selection.number }}
                </div>
                <div class="flex-1 group">
                  <div class="whitespace-pre-wrap">
                    <MessageWithReactions
                      :message="selection.msg"
                      :initial-reactions="selection.reactions"
                      @reaction-changed="
                        (emoji: string, isAdded: boolean) =>
                          handleReactionChange(selection, emoji, isAdded)
                      "
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
    <main class="w-full pt-[60px]">
      <div class="mx-auto w-full max-w-[1200px] pb-8">
        <div id="screens" class="space-y-10 py-5">
          <div
            v-for="(screen, index) in screens"
            :key="index"
            class="screen-container"
            :data-index="index"
          >
            <div class="controls overflow-hidden" :data-id="screen.id">
              <div class="mb-2 font-bold">
                {{ screen.title || 'Untitled' }}
              </div>
              <div class="relative select-none">
                <img
                  :src="screen.imageUrl"
                  :width="screen.width"
                  :height="screen.height"
                  class="target-image bg-white shadow-md"
                />
                <div
                  v-for="(selection, sIndex) in screen.selections"
                  :key="sIndex"
                  class="selection-box group absolute border-2 hover:z-[10000] bg-black/10 rounded-md"
                  :style="selectionStyle(selection)"
                  :data-id="selection.id"
                  data-type="note"
                  @mouseenter="adjustTooltipPosition"
                  @click="selectNote(selection.id)"
                >
                  <span
                    class="w-6 h-6 mt-1 ml-1 flex justify-center content-center items-center rounded-full text-xs font-bold group-hover:opacity-20"
                    :style="getDynamicStyles(selection.color || '#ff0000')"
                    >{{ selection.number }}</span
                  >
                  <div
                    v-if="selection.msg?.trim()"
                    class="tooltip absolute w-screen max-w-[350px] break-words shadow-md border-2 border-orange-500 rounded-md bg-white/80 p-4 text-base whitespace-pre-wrap hidden group-hover:block"
                  >
                    {{ selection.msg }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BoardService } from '@/services/boardService';
import { scrollToElement, selectNote } from '@/utils/utils';
import MessageWithReactions from '@/components/MessageWithReactions.vue';
import type { Screen, Selection } from '@/types';

const route = useRoute();

const boardService = new BoardService();

const isLoading = ref(false);

const screens = ref<Screen[]>([]);

const adjustTooltipPosition = (event: MouseEvent) => {
  const note = event.currentTarget as HTMLElement;
  const parent = note.closest('.relative') as HTMLElement;
  const tooltip = note.querySelector('.tooltip') as HTMLElement;

  if (!note || !tooltip || !parent) return;

  const noteRect = note.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.classList.remove('tooltip-left', 'tooltip-right', 'tooltip-top', 'tooltip-bottom');

  if (noteRect.right + tooltipRect.width > parentRect.right + noteRect.width * 0.5) {
    tooltip.classList.add('tooltip-right');
  } else {
    tooltip.classList.add('tooltip-left');
  }

  if (noteRect.top - tooltipRect.height < parentRect.top) {
    tooltip.classList.add('tooltip-bottom');
  } else {
    tooltip.classList.add('tooltip-top');
  }
};

const selectionStyle = (selection: Selection) => ({
  left: `${selection.x}px`,
  top: `${selection.y}px`,
  width: `${selection.width}px`,
  height: `${selection.height}px`,
  borderColor: selection.color,
});

// CUSTOM STYLE

const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const getDynamicStyles = (color: string) => {
  return {
    backgroundColor: color,
    color: getContrastColor(color),
  };
};

const handleReactionChange = (selection: Selection, emoji: string, isAdded: boolean) => {
  console.log('Selection:', selection);
  if (isAdded) {
    console.log(`Add reaction ${emoji}`);
  } else {
    console.log(`Remove reaction ${emoji}`);
  }
};

const fetchBoard = async () => {
  try {
    isLoading.value = true;
    const response = await boardService.getBoard(route.params.id as string);
    if (response.data?.screens?.length) {
      screens.value = response.data.screens;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (!route.params.id) {
    console.error('No board ID provided');
    return;
  }
  fetchBoard();
});
</script>

<style scoped></style>
