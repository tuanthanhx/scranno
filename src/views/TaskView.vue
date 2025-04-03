<template>
  <div class="bg-gray-50 min-h-screen max-w-[1280px] px-5">
    <div class="controls py-5">
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      />
      <input type="file" id="importInput" accept=".json" />
      <button
        id="exportBtn"
        class="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        disabled
      >
        Export All
      </button>
    </div>
    <div
      id="screens"
      class="py-5 bg-gray-100"
      ref="screensContainer"
      @mousedown="startAction"
      @dragstart.prevent
    >
      <div
        v-for="(screen, index) in screens"
        :key="index"
        class="screen-container my-5 border border-gray-300 p-2.5"
        :data-index="index"
      >
        <div class="controls mb-2.5">
          <button
            @click="screen.addingRectangle = true"
            class="px-2 py-1 mb-3 bg-green-500 text-white rounded"
          >
            [Add Note]
          </button>
          <div class="overflow-hidden">
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
                class="selection-box absolute border-2 border-dashed border-red-500 bg-red-100/10 cursor-move"
                :style="selectionStyle(selection)"
                @mousedown.stop="startMove($event, screen, selection)"
              >
                <div
                  class="selection-label bg-white/80 px-1.5 py-0.5 text-xs pointer-events-none"
                  :style="{ left: '20px', top: '20px' }"
                >
                  {{ selection.msg }}
                </div>
                <div
                  v-for="corner in ['top-left', 'top-right', 'bottom-right', 'bottom-left']"
                  :key="corner"
                  class="resize-handle absolute w-2 h-2 bg-red-500"
                  :class="resizeHandleClass(corner)"
                  @mousedown.stop="startResize($event, screen, selection, corner)"
                ></div>
              </div>
            </div>
            <div>
              <pre class="overflow-auto">{{ screen }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-controls py-5">
      <button @click="triggerImageInput" class="px-4 py-2 bg-blue-500 text-white rounded">
        Add Screen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface Selection {
  x: number
  y: number
  width: number
  height: number
  msg?: string
}

interface Screen {
  index: number
  imageUrl: string
  width: number
  height: number
  selections: Selection[]
  addingRectangle: boolean
  status: string
}

const screens = ref<Screen[]>([])
const screensContainer = ref<HTMLElement | null>(null)

const imageInput = ref<HTMLInputElement | null>(null)
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

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', endAction)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', endAction)
})

const triggerImageInput = () => imageInput.value?.click()

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

const MAX_FILE_SIZE = 4.5 * 1024 * 1024 // 4.5MB

const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (file.size > MAX_FILE_SIZE) {
    alert('File size must be under 1MB')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const { url, width, height } = await response.json()

    if (!url) {
      alert('Cannot upload file')
      return
    }

    // Create a screen object with uploaded file URL
    const screen = createScreen(file.name, url, width, height)
    screens.value.push(screen)

    // Reset the file input correctly
    target.value = ''
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Failed to upload file')
  }
}

// const handleImport = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   const file = target.files?.[0]
//   if (file) {
//     const reader = new FileReader()
//     reader.onload = (event) => {
//       const importedData = JSON.parse(event.target?.result as string)
//       importScreens(importedData)
//       target.value = ''
//     }
//     reader.readAsText(file)
//   }
// }

const createScreen = (filename: string, imageUrl, width: number, height: number): Screen => ({
  index: screens.value.length,
  imageUrl,
  width,
  height,
  selections: [],
  addingRectangle: false,
  status: 'new',
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
    state.currentBox = { x: state.startX, y: state.startY, width: 0, height: 0 }
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

const endSelection = (e: MouseEvent) => {
  if (!state.currentBox || !state.currentScreen) return
  state.isDragging = false
  state.currentScreen.addingRectangle = false
  const text = prompt('Enter text for this selection:')
  if (text) state.currentBox.msg = text
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
</script>

<style scoped></style>
