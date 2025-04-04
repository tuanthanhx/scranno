<template>
  <div class="bg-gray-100 min-h-screen w-full min-w-[1520px] flex">
    <aside class="flex-[300px_0_0] bg-orange-500">
      <div
        class="fixed top-0 left-0 w-[300px] h-screen overflow-x-hidden overflow-y-auto bg-white shadow-md space-y-10"
      >
        <div v-for="(screen, index) in screens" :key="index" :data-index="index">
          <h2 class="font-bold mb-5 text-center bg-blue-200 p-2">Screen {{ index + 1 }}</h2>
          <div class="px-4">
            <ul class="space-y-4">
              <li v-for="(selection, sIndex) in screen.selections" :key="sIndex" class="flex">
                <div
                  class="w-6 h-6 mr-3 relative top-0.5 flex justify-center content-center items-center bg-red-500 rounded-full text-xs font-bold text-white"
                >
                  {{ selection.number }}
                </div>
                <div class="flex-1 overflow-hidden">
                  <div>{{ selection.msg }}</div>
                  <div class="mt-2">
                    <div class="flex justify-end">
                      <a href="#edit" @click="editNote(screen.id, selection.id)">Edit</a>
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
    <main class="w-full">
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
            <div class="controls" :class="{ 'is-adding': screen.addingRectangle }">
              <button
                @click="screen.addingRectangle = true"
                class="button-add-note px-2 py-1 mb-3 bg-green-500 text-white rounded"
              >
                [Add Note]
              </button>
              <div class="relative select-none">
                <img
                  ref="imageRefs"
                  :src="screen.imageUrl"
                  :width="screen.width"
                  :height="screen.height"
                  class="target-image"
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
                    class="absolute w-screen max-w-[350px] break-words left-[75%] bottom-[110%] shadow-md border-2 border-orange-500 rounded-md bg-white/80 p-2 text-base hidden group-hover:block after:absolute after:bottom-[-16px] after:left-2 after:border-8 after:border-transparent after:border-t-orange-500"
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
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
              :class="{ 'bg-gray-100': isDragging }"
            >
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
              <p class="text-gray-600">Drag and drop an image here or click to select</p>
              <p class="text-sm text-gray-500 mt-2">(Only image files are accepted)</p>
            </div>
          </div>
          <!-- <button @click="triggerImageInput" class="px-4 py-2 bg-blue-500 text-white rounded">
            Add Screen
          </button> -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import IconList from '@/components/IconList.vue'

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

const totalSelections = computed(() =>
  screens.value.reduce((count, screen) => count + screen.selections.length, 0),
)

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
    // Check if the dropped file is an image
    if (files[0].type.startsWith('image/')) {
      processFile(files[0])
    } else {
      console.error('Please drop an image file')
    }
  }
}

const MAX_FILE_SIZE = 4.5 * 1024 * 1024 // 4.5MB

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
    const { width, height } = await getImageDimensions(file)
    const imageUrl = URL.createObjectURL(file)
    const screen = createScreen(imageUrl, width, height)
    screens.value.push(screen)
    imageInput.value.value = ''
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
      number: totalSelections.value + 1,
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
  // const text = prompt('Enter text for this selection:')
  // if (text) state.currentBox.msg = text
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

const editNote = (screenId, selectionId) => {
  console.log(screenId, selectionId)
  const text = prompt('Enter text for this selection:')
  // if (text) state.currentBox.msg = text
  if (text) console.log(text)
}

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
  opacity: 0;
  visibility: hidden;
}
.controls.is-adding .selection-box {
  opacity: 0.5;
  pointer-events: none;
}
</style>
