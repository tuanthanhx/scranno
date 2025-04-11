import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ServerBoard } from '@/types';

export const useBoardStore = defineStore('board', () => {
  const board = ref<ServerBoard | null>(null);

  const setBoard = (newBoard: ServerBoard) => {
    board.value = newBoard;
  };

  const clearBoard = () => {
    board.value = null;
  };

  return { board, setBoard, clearBoard };
});
