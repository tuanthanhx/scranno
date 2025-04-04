<template>
  <div class="bg-gray-100 min-h-screen w-full min-w-[1520px] flex">
    <aside class="flex-[300px_0_0] relative z-[9000]">
      <div
        class="fixed top-0 left-0 w-[300px] pt-[60px] h-screen overflow-x-hidden overflow-y-auto bg-white shadow-md space-y-10"
      >
        <div v-for="(screen, index) in screens" :key="index" :data-index="index">
          <div class="group relative font-bold mb-5 text-center bg-blue-200 p-4 leading-5">
            <div>{{ screen.title || 'Untitled' }}</div>
            <div
              class="absolute bg-white p-2 rounded-md top-1/2 translate-y-[-50%] right-4 opacity-0 group-hover:opacity-100 flex space-x-3"
            >
              <button @click="openEditScreenModal(screen)">
                <PencilSquareIcon
                  class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                />
              </button>
              <button @click="openConfirmDeleteScreenModal(screen)">
                <TrashIcon class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
              </button>
            </div>
          </div>
          <div class="px-4">
            <ul class="space-y-4">
              <li v-for="(selection, sIndex) in screen.selections" :key="sIndex" class="flex">
                <div
                  class="w-6 h-6 mr-3 relative top-0.5 flex justify-center content-center items-center bg-red-500 rounded-full text-xs font-bold text-white"
                >
                  {{ selection.number }}
                </div>
                <div class="flex-1 group overflow-hidden">
                  <div class="whitespace-pre-wrap">{{ selection.msg }}</div>
                  <div class="mt-2 opacity-0 group-hover:opacity-100">
                    <div class="flex justify-end space-x-3">
                      <button @click="openEditNoteModal(screen, selection)">
                        <PencilSquareIcon
                          class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                        />
                      </button>
                      <button @click="openConfirmDeleteNoteModal(screen, selection)">
                        <TrashIcon
                          class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>
                  <div class="mt-2 hidden">
                    <IconList />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
    <main class="w-full pt-[60px]">
      <div class="mx-auto w-full max-w-[1200px]">
        <div class="controls py-5 hidden">
          <!-- <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload" /> -->
          <input type="file" id="importInput" accept=".json" />
          <button
            :disabled="screens.length === 0"
            @click="exportAll"
            class="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
          >
            Export All
          </button>
        </div>
        <div
          id="screens"
          class="space-y-10 py-5"
          ref="screensContainer"
          @mousedown="startAction"
          @dragstart.prevent
        >
          <div
            v-for="(screen, index) in screens"
            :key="index"
            class="screen-container"
            :data-index="index"
          >
            <div class="controls overflow-hidden" :class="{ 'is-adding': screen.addingRectangle }">
              <div class="group relative font-bold mb-5 text-center bg-blue-200 p-4 leading-5">
                <div>{{ screen.title || 'Untitled' }}</div>
                <div
                  class="absolute bg-white p-2 rounded-md top-1/2 translate-y-[-50%] right-4 opacity-0 group-hover:opacity-100 flex space-x-3"
                >
                  <button @click="openEditScreenModal(screen)">
                    <PencilSquareIcon
                      class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                    />
                  </button>
                  <button @click="openConfirmDeleteScreenModal(screen)">
                    <TrashIcon class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                  </button>
                </div>
              </div>
              <button
                @click="screen.addingRectangle = true"
                class="button-add-note px-2 py-1 mb-3 bg-green-500 text-white rounded"
              >
                Add Note
              </button>
              <div class="relative select-none">
                <img
                  ref="imageRefs"
                  :src="screen.imageUrl"
                  :width="screen.width"
                  :height="screen.height"
                  class="target-image bg-white shadow-md"
                />
                <div
                  v-for="(selection, sIndex) in screen.selections"
                  :key="sIndex"
                  class="selection-box group absolute border-2 border-red-500 hover:border-red-500/50 hover:z-[10000] bg-black/10 cursor-move rounded-md"
                  :style="selectionStyle(selection)"
                  @mousedown.stop="startMove($event, screen, selection)"
                >
                  <span
                    class="w-6 h-6 mt-1 ml-1 flex justify-center items-center bg-red-500 rounded-full text-xs font-bold text-white group-hover:opacity-20"
                    >{{ selection.number }}</span
                  >
                  <div
                    v-if="selection.msg?.trim()"
                    class="absolute w-screen max-w-[350px] break-words left-[75%] bottom-[110%] shadow-md border-2 border-orange-500 rounded-md bg-white/80 p-2 text-base whitespace-pre-wrap hidden group-hover:block after:absolute after:bottom-[-16px] after:left-2 after:border-8 after:border-transparent after:border-t-orange-500"
                  >
                    {{ selection.msg }}
                  </div>
                  <div
                    v-for="corner in ['top-left', 'top-right', 'bottom-right', 'bottom-left']"
                    :key="corner"
                    class="resize-handle opacity-0 absolute w-2 h-2 bg-red-500"
                    :class="resizeHandleClass(corner)"
                    @mousedown.stop="startResize($event, screen, selection, corner)"
                  ></div>
                </div>
              </div>
              <!-- <div class="max-h-[200px] overflow-auto border-gray-900 border-1"><pre>{{ screen }}</pre></div> -->
            </div>
          </div>
        </div>
        <div class="footer-controls py-5">
          <div class="controls py-5">
            <div
              ref="dropZone"
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @paste="handlePaste"
              :class="{ 'bg-gray-100': isDragging }"
            >
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
              <div class="space-y-4">
                <p class="text-gray-600">
                  Drag and drop, paste, or use the button to select an image
                </p>
                <button
                  @click.stop="triggerFileInput"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors"
                >
                  Select Image
                </button>
                <p class="text-sm text-gray-500">(Only image files are accepted)</p>
              </div>
            </div>
          </div>
          <!-- <button @click="triggerImageInput" class="px-4 py-2 bg-blue-500 text-white rounded">
            Add Screen
          </button> -->
        </div>
      </div>
    </main>

    <EditScreenModal
      :is-open="modalState.showEditScreenModal"
      :initial-text="modalState.selectedScreen?.title"
      @update="handleEditScreen"
      @close="closeModals"
    />
    <EditNoteModal
      :is-open="modalState.showEditNoteModal"
      :initial-text="modalState.selectedNote?.msg"
      @update="handleEditNote"
      @close="closeModals"
    />
    <ConfirmationModal
      :is-open="modalState.showDeleteScreenModal"
      title="Confirm Deletion"
      message="Are you sure you want to delete this screen? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteScreen"
      @close="closeModals"
    />
    <ConfirmationModal
      :is-open="modalState.showDeleteNoteModal"
      title="Confirm Deletion"
      message="Are you sure you want to delete this note? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteNote"
      @close="closeModals"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import IconList from '@/components/IconList.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import EditScreenModal from '@/components/EditScreenModal.vue'
import EditNoteModal from '@/components/EditNoteModal.vue'

import { PencilSquareIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'

interface Selection {
  id: string
  number: number
  x: number
  y: number
  width: number
  height: number
  msg?: string
}

interface Screen {
  id: string
  title: string
  index: number
  imageUrl: string
  width: number
  height: number
  addingRectangle: boolean
  status: string
  selections: Selection[]
}

const screens = ref<Screen[]>([])
const screensContainer = ref<HTMLElement | null>(null)

const imageInput = ref<HTMLInputElement | null>(null)
const dropZone = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const imageRefs = ref<HTMLImageElement[]>([])
// const importInput = ref<HTMLInputElement | null>(null)

const state = reactive({
  isDragging: false,
  isResizing: false,
  isMoving: false,
  startX: 0,
  startY: 0,
  currentBox: null as Selection | null,
  currentScreen: null as Screen | null,
  resizeHandle: null as string | null,
})

const highestSelectionNumber = computed(() => {
  if (screens.value.length === 0) return 0

  const allNumbers = screens.value
    .flatMap((screen) => screen.selections)
    .map((selection) => selection.number)

  return allNumbers.length > 0 ? Math.max(...allNumbers) : 0
})

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', endAction)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', endAction)
})

const triggerFileInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    if (files[0].type.startsWith('image/')) {
      processFile(files[0])
    } else {
      console.error('Please drop an image file')
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (items) {
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          processFile(file)
          document.body.focus()
          break
        }
      }
    }
  }
}

const MAX_FILE_SIZE = 4.5 * 1024 * 1024 // 4.5MB
const MAX_FILE_WIDTH = 1200

const processFile = async (file: File) => {
  if (!file) return

  if (file.size > MAX_FILE_SIZE) {
    alert('File size must be under 4.5MB')
    return
  }

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const imageUrl = URL.createObjectURL(file)
      img.onload = () => {
        const dimensions = {
          width: img.width,
          height: img.height,
        }
        URL.revokeObjectURL(imageUrl)
        resolve(dimensions)
      }
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        reject(new Error('Failed to load image'))
      }
      img.src = imageUrl
    })
  }

  try {
    const imageUrl = URL.createObjectURL(file)
    const { width, height } = await getImageDimensions(file)
    let newWidth = width
    let newHeight = height
    if (width > MAX_FILE_WIDTH) {
      newWidth = MAX_FILE_WIDTH
      newHeight = Math.round((MAX_FILE_WIDTH / width) * height)
    }
    const screen = createScreen(imageUrl, newWidth, newHeight)
    screens.value.push(screen)
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  } catch (error) {
    console.error('Error processing image:', error)
    alert('Failed to process the image')
  }
}

// const handleImageUpload = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   const file = target.files?.[0]
//   if (file) {
//     const screen = createScreen(file.name)
//     screens.value.push(screen)
//     target.value = ''
//     // const reader = new FileReader()
//     // reader.onload = (event) => {
//     //   const screen = createScreen(file.name, event.target?.result as string)
//     //   screens.value.push(screen)
//     //   target.value = ''
//     // }
//     // reader.readAsDataURL(file)
//   }
// }

// const handleImageUpload = async (e: Event) => {
//   const target = e.target as HTMLInputElement
//   const file = target.files?.[0]

//   if (!file) return

//   if (file.size > MAX_FILE_SIZE) {
//     alert('File size must be under 1MB')
//     return
//   }

//   try {
//     const formData = new FormData()
//     formData.append('file', file)
//     const response = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData,
//     })

//     if (!response.ok) {
//       throw new Error('Upload failed')
//     }

//     const { url, width, height } = await response.json()

//     if (!url) {
//       alert('Cannot upload file')
//       return
//     }

//     // Create a screen object with uploaded file URL
//     const screen = createScreen(file.name, url, width, height)
//     screens.value.push(screen)

//     // Reset the file input correctly
//     target.value = ''
//   } catch (error) {
//     console.error('Error uploading file:', error)
//     alert('Failed to upload file')
//   }
// }

const createScreen = (imageUrl: string, width: number, height: number): Screen => ({
  id: uuidv4(),
  title: 'Untitled',
  index: screens.value.length,
  imageUrl,
  width,
  height,
  status: 'new',
  addingRectangle: false,
  selections: [],
})

const selectionStyle = (selection: Selection) => ({
  left: `${selection.x}px`,
  top: `${selection.y}px`,
  width: `${selection.width}px`,
  height: `${selection.height}px`,
})

const resizeHandleClass = (corner: string) => ({
  'top-left': corner === 'top-left',
  'top-right': corner === 'top-right',
  'bottom-right': corner === 'bottom-right',
  'bottom-left': corner === 'bottom-left',
  'cursor-nwse-resize': corner === 'top-left' || corner === 'bottom-right',
  'cursor-nesw-resize': corner === 'top-right' || corner === 'bottom-left',
  '-top-1 -left-1': corner === 'top-left',
  '-top-1 -right-1': corner === 'top-right',
  '-bottom-1 -right-1': corner === 'bottom-right',
  '-bottom-1 -left-1': corner === 'bottom-left',
})

const findScreen = (target: HTMLElement): Screen | undefined => {
  let element = target
  while (element && !element.classList.contains('screen-container')) {
    element = element.parentElement as HTMLElement
  }
  return screens.value.find((s) => s.index === Number(element?.dataset.index))
}

const startAction = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const screen = findScreen(target)
  if (!screen) return

  if (target.classList.contains('resize-handle')) return
  if (target.classList.contains('selection-box')) return

  if (screen.addingRectangle && target.classList.contains('target-image')) {
    const rect = target.getBoundingClientRect()
    state.isDragging = true
    state.startX = e.clientX - rect.left
    state.startY = e.clientY - rect.top
    state.currentBox = {
      id: uuidv4(),
      number: highestSelectionNumber.value + 1,
      x: state.startX,
      y: state.startY,
      width: 0,
      height: 0,
    }
    state.currentScreen = screen
    screen.selections.push(state.currentBox)
  }
}

const startResize = (e: MouseEvent, screen: Screen, selection: Selection, corner: string) => {
  state.isResizing = true
  state.resizeHandle = corner
  state.currentBox = selection
  state.currentScreen = screen
  const rect = imageRefs.value[screen.index]?.getBoundingClientRect()
  if (rect) {
    state.startX = e.clientX - rect.left
    state.startY = e.clientY - rect.top
  }
  e.preventDefault()
}

const startMove = (e: MouseEvent, screen: Screen, selection: Selection) => {
  state.isMoving = true
  state.currentBox = selection
  state.currentScreen = screen
  const rect = imageRefs.value[screen.index]?.getBoundingClientRect()
  if (state.currentBox && rect) {
    state.startX = e.clientX - rect.left - state.currentBox.x
    state.startY = e.clientY - rect.top - state.currentBox.y
  }
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!state.currentScreen || !state.currentBox) return
  if (state.isDragging) drawSelection(e)
  else if (state.isResizing) resizeSelection(e)
  else if (state.isMoving) moveSelection(e)
}

const drawSelection = (e: MouseEvent) => {
  if (!state.currentBox || !state.currentScreen) return
  const rect = imageRefs.value[state.currentScreen.index]?.getBoundingClientRect()
  if (rect) {
    const currentX = Math.max(0, Math.min(e.clientX - rect.left, state.currentScreen.width))
    const currentY = Math.max(0, Math.min(e.clientY - rect.top, state.currentScreen.height))
    state.currentBox.width = Math.abs(currentX - state.startX)
    state.currentBox.height = Math.abs(currentY - state.startY)
    state.currentBox.x = Math.min(state.startX, currentX)
    state.currentBox.y = Math.min(state.startY, currentY)
  }
}

const resizeSelection = (e: MouseEvent) => {
  if (!state.currentBox || !state.currentScreen) return
  const rect = imageRefs.value[state.currentScreen.index]?.getBoundingClientRect()
  if (rect) {
    const currentX = Math.max(0, Math.min(e.clientX - rect.left, state.currentScreen.width))
    const currentY = Math.max(0, Math.min(e.clientY - rect.top, state.currentScreen.height))
    let { x, y, width, height } = state.currentBox

    if (state.resizeHandle === 'bottom-right') {
      width = currentX - x
      height = currentY - y
    } else if (state.resizeHandle === 'top-left') {
      width = x + width - currentX
      height = y + height - currentY
      x = currentX
      y = currentY
    } else if (state.resizeHandle === 'top-right') {
      width = currentX - x
      height = y + height - currentY
      y = currentY
    } else if (state.resizeHandle === 'bottom-left') {
      width = x + width - currentX
      height = currentY - y
      x = currentX
    }

    state.currentBox.x = x
    state.currentBox.y = y
    state.currentBox.width = Math.max(10, width)
    state.currentBox.height = Math.max(10, height)
  }
}

const moveSelection = (e: MouseEvent) => {
  if (!state.currentBox || !state.currentScreen) return
  const rect = imageRefs.value[state.currentScreen.index]?.getBoundingClientRect()
  if (rect) {
    const newX = Math.max(
      0,
      Math.min(
        e.clientX - rect.left - state.startX,
        state.currentScreen.width - state.currentBox.width,
      ),
    )
    const newY = Math.max(
      0,
      Math.min(
        e.clientY - rect.top - state.startY,
        state.currentScreen.height - state.currentBox.height,
      ),
    )
    state.currentBox.x = newX
    state.currentBox.y = newY
  }
}

const endAction = (e: MouseEvent) => {
  if (state.isDragging) endSelection(e)
  else if (state.isResizing) endResize()
  else if (state.isMoving) endMove()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const endSelection = (e: MouseEvent) => {
  if (!state.currentBox || !state.currentScreen) return
  state.isDragging = false
  state.currentScreen.addingRectangle = false
  openEditNoteModal(state.currentScreen, state.currentBox)
  state.currentBox = null
  state.currentScreen = null
}

const endResize = () => {
  state.isResizing = false
  state.resizeHandle = null
  state.currentBox = null
  state.currentScreen = null
}

const endMove = () => {
  state.isMoving = false
  state.currentBox = null
  state.currentScreen = null
}

// MODALS

interface ModalState {
  showDeleteScreenModal: boolean;
  showDeleteNoteModal: boolean;
  showEditScreenModal: boolean;
  showEditNoteModal: boolean;
  selectedScreen: Screen | null;
  selectedNote: Selection | null;
}

const modalState = reactive<ModalState>({
  showDeleteScreenModal: false,
  showDeleteNoteModal: false,
  showEditScreenModal: false,
  showEditNoteModal: false,
  selectedScreen: null,
  selectedNote: null,
})

const closeModals = () => {
  modalState.showDeleteScreenModal = false
  modalState.showDeleteNoteModal = false
  modalState.showEditScreenModal = false;
  modalState.showEditNoteModal = false;
}

const openConfirmDeleteScreenModal = (screen: Screen) => {
  modalState.selectedScreen = screen
  modalState.showDeleteScreenModal = true
}

const openConfirmDeleteNoteModal = (screen: Screen, note: Selection) => {
  modalState.selectedScreen = screen
  modalState.selectedNote = note
  modalState.showDeleteNoteModal = true
}

const openEditScreenModal = (screen: Screen) => {
  modalState.selectedScreen = screen;
  modalState.showEditScreenModal = true;
}

const openEditNoteModal = (screen: Screen, note: Selection) => {
  modalState.selectedScreen = screen;
  modalState.selectedNote = note;
  modalState.showEditNoteModal = true;
}

const handleDeleteScreen = () => {
  const screenIndex = screens.value.findIndex((screen) => screen.id === modalState.selectedScreen?.id)
  if (screenIndex !== -1) {
    screens.value.splice(screenIndex, 1)
  }
  closeModals();
}

const handleDeleteNote = () => {
  const screen = screens.value.find((s) => s.id === modalState.selectedScreen?.id)
  if (screen) {
    const selectionIndex = screen.selections.findIndex((sel) => sel.id === modalState.selectedNote?.id)
    if (selectionIndex !== -1) {
      screen.selections.splice(selectionIndex, 1)
    }
  }
  closeModals();
}

const handleEditScreen = (newTitle: string) => {
  const screen = screens.value.find((s) => s.id === modalState.selectedScreen?.id)
  if (screen) {
    screen.title = newTitle
  }
  closeModals();
}

const handleEditNote = (newText: string) => {
  const screen = screens.value.find((s) => s.id === modalState.selectedScreen?.id)
  if (screen) {
    const selection = screen.selections.find((sel) => sel.id === modalState.selectedNote?.id)
    if (selection) {
      selection.msg = newText
    }
  }
  closeModals();
}

// Feature : Export

const exportAll = () => {
  const exportData = screens.value.map((screen) => ({
    index: screen.index,
    id: screen.id,
    imageUrl: screen.imageUrl,
    status: screen.status,
    width: screen.width,
    height: screen.height,
    notes: screen.selections.map((s) => ({
      id: s.id,
      number: s.number,
      x: Math.round(s.x),
      y: Math.round(s.y),
      w: Math.round(s.width),
      h: Math.round(s.height),
      msg: s.msg || '',
    })),
  }))

  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'all_screens.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.controls.is-adding .target-image {
  cursor: crosshair;
}
.controls.is-adding .button-add-note {
  opacity: 0.5;
  pointer-events: none;
}
.controls.is-adding .selection-box {
  opacity: 0.5;
  pointer-events: none;
}
</style>
