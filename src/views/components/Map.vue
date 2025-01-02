<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { Point } from '../types'
import { useDraggable } from '@vueuse/core'

const props = defineProps({
  offset: {
    type: Object as PropType<Point>,
    required: true,
  },
  points: {
    type: Array as PropType<Point[]>,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits<{
  updateDom: [el: HTMLDivElement]
}>()
const updateMapRef = (el: any) => {
  emit('updateDom', el)
}
</script>

<template>
  <div
    :ref="updateMapRef"
    class="bg-cover bg-center bg-[url('/maps/img_map_101.webp')] absolute cursor-pointer w-[2048px] h-[2048px]"
  >
    <div className="relative w-full h-full">
      <template v-for="(point, index) in points" :key="index">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          class="absolute w-[32px] h-[32px] top-0 left-0"
          :style="{
            transform: `translate3d(${point.x - 16}px, ${point.y - 16}px, 0)`,
          }"
        >
          <path
            d="M512 384c-70.69 0-128 57.31-128 128s57.31 128 128 128 128-57.31 128-128-57.31-128-128-128z"
            fill="#999999"
            p-id="7215"
          ></path>
          <path
            d="M512 64C264.58 64 64 264.58 64 512s200.58 448 448 448 448-200.58 448-448S759.42 64 512 64z m74.34 792.14l-53.02-91.83c-9.47-16.41-33.16-16.41-42.64 0l-53.02 91.83c-134.74-28.97-240.84-135.05-269.8-269.8l91.83-53.02c16.41-9.47 16.41-33.16 0-42.64l-91.83-53.02c28.97-134.74 135.06-240.84 269.8-269.8l53.02 91.83c9.47 16.41 33.16 16.41 42.64 0l53.02-91.83c134.75 28.97 240.84 135.06 269.81 269.8l-91.83 53.02c-16.41 9.47-16.41 33.16 0 42.64l91.83 53.02c-28.98 134.74-135.07 240.83-269.81 269.8z"
            fill="#999999"
            p-id="7216"
          ></path>
        </svg>
      </template>
    </div>
  </div>
</template>
