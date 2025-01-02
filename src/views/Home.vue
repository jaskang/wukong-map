<script setup lang="ts">
import { useDraggable, useLocalStorage } from '@vueuse/core'
import Map from './components/Map.vue'
import { Button, Input } from './../components/index'
import { computed, ref } from 'vue'
import type { Point } from './types'
import { toNumber, trim } from 'kotl'

const wrapElRef = ref<HTMLElement | null>(null)
const mapElRef = ref<HTMLElement | null>(null)

const {
  x: offsetX,
  y: offsetY,
  style,
} = useDraggable(mapElRef, {
  initialValue: { x: 0, y: 0 },
})

const parseInput = (input: string = '') => {
  const [x, y] = input.split(',').map(v => toNumber(trim(v), 0))
  return { x: x ?? 0, y: y ?? 0 }
}

const mapPointA = useLocalStorage('mapPointA', { x: 0, y: 0 })
const realPointA = useLocalStorage('realPointA', { x: 0, y: 0 })
const mapPointB = useLocalStorage('mapPointB', { x: 0, y: 0 })
const realPointB = useLocalStorage('realPointB', { x: 0, y: 0 })

// const scaleX = (realPointB!.x - realPointA!.x) / (mapPointB!.x - mapPointA!.x)
// const scaleY = (realPointB!.y - realPointA!.y) / (mapPointB!.y - mapPointA!.y)
const scaleX = 56
const scaleY = 56

// 根据 点A 和 点B 的地图坐标和实际坐标，计算出实际坐标到地图坐标的映射关系
const realToMap = ({ x, y }: Point) => {
  const xStr = (mapPointA.value.x + (x - realPointA.value.x) / scaleX).toFixed(2)
  const yStr = (mapPointA.value.y + (y - realPointA.value.y) / scaleY).toFixed(2)
  console.log(`mapPointA.x：${mapPointA.value.x} realPointA.x：${realPointA.value.x} scaleX：${scaleX}`)
  console.log(`mapPointA.y：${mapPointA.value.y} realPointA.y：${realPointA.value.y} scaleY：${scaleY}`)
  console.log(`realToMap: ${x}, ${y} -> ${xStr}, ${yStr}`)
  return {
    x: toNumber(xStr)!,
    y: toNumber(yStr)!,
  }
}

const mapToReal = ({ x, y }: Point) => {
  return {
    x: realPointA.value.x + (x - mapPointA.value.x) * scaleX,
    y: realPointA.value.y + (y - mapPointA.value.y) * scaleY,
  }
}

const center = computed(() => {
  console.log(wrapElRef.value)
  const rect = wrapElRef.value?.getBoundingClientRect()
  if (rect) {
    const [w, h] = [rect.width / 2, rect.height / 2]
    const map = { x: offsetX.value * -1 + w, y: offsetY.value * -1 + h }
    return {
      map: map,
      real: mapToReal(map),
    }
  }
  return {
    map: { x: 0, y: 0 },
    real: { x: 0, y: 0 },
  }
})

const bounds = computed(() => {
  return {
    start: mapToReal({ x: 0, y: 0 }),
    end: mapToReal({ x: 4096, y: 4096 }),
  }
})

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    offsetY.value -= 1
  }
  if (event.key === 'ArrowDown') {
    offsetY.value += 1
  }
  if (event.key === 'ArrowLeft') {
    offsetX.value -= 1
  }
  if (event.key === 'ArrowRight') {
    offsetX.value += 1
  }
}

const points = ref<Point[]>([
  { x: -16078.579406, y: 23212.450274, z: 1631.47315 }, // RebirthPoint_HFS_C_9 翠竹林-后山
  { x: 1300.2323, y: 64355.234375, z: 975.849121 }, // RebirthPoint_HFS_C_7 翠竹林-白雾泽
  { x: -425.251923, y: 54947.25, z: 1205.412804 }, // RebirthPoint_HFS_C_6 翠竹林-蛇径
  { x: 1321.775513, y: 11999.84375, z: 1121.336426 }, // RebirthPoint_HFS_C_5 苍狼林-观音禅院
  { x: -63974.664062, y: 28486.105469, z: 8101.832031 }, // RebirthPoint_HFS_C_4 黑风洞-见谛峰
  { x: -35111.868485, y: 18220.894028, z: -921.253999 }, // RebirthPoint_HFS_C_3 苍狼林-前山
  { x: -62018.049156, y: 64197.80495, z: -1762.951053 }, // RebirthPoint_HFS_C_2 黑风洞-洞内
  { x: -85214.835862, y: 59839.779841, z: -192.969867 }, // RebirthPoint_HFS_C_11 黑风洞-洞外
  { x: 3002.896729, y: -14980.264648, z: 4516.431152 }, // RebirthPoint_HFS_C_1 苍狼林-林外
  { x: -59216.141769, y: 20820.697949, z: -2223.647438 }, // BP_RebirthPointZhaoHunFanBase_C_1 招魂幡
])
</script>

<template>
  <div class="w-screen h-screen flex" @keydown="handleKeyDown">
    <div ref="wrapElRef" class="w-[100vh] h-[100vh] overflow-hidden relative">
      <Map
        @updateDom="el => (mapElRef = el)"
        :style="style"
        :size="4096"
        :offset="{ x: offsetX, y: offsetY }"
        :points="points"
        :realToMap="realToMap"
      ></Map>
      <div class="absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg class="text-red-500 w-12 h-12" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M501.028571 343.771429h7.314286v164.571428H343.771429v-7.314286H0v21.942858h343.771429v-7.314286h164.571428V680.228571h-7.314286v343.771429h21.942858V680.228571h-7.314286V515.657143H680.228571v7.314286h343.771429v-21.942858H680.228571v7.314286H515.657143V343.771429h7.314286V0h-21.942858v343.771429z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
    <div class="flex-1 h-screen p-4 gap-4 flex flex-col">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <span>地图坐标：</span>
          <Input
            type="text"
            placeholder="123.123, 123.123"
            :value="`${mapPointA.x}, ${mapPointA.y}`"
            @change="
              e => {
                mapPointA = parseInput(e)
              }
            "
          />
          <span>游戏坐标：</span>
          <Input
            type="text"
            placeholder="123.123, 123.123"
            :value="`${realPointA?.x}, ${realPointA?.y}`"
            @input="
              e => {
                realPointA = parseInput(e)
              }
            "
          />
          <Button variant="solid" color="primary" @click="mapPointA = { ...center.map }"> 更新 </Button>
        </div>
        <div class="flex gap-2 items-center">
          <span>地图坐标：</span>
          <Input
            type="text"
            placeholder="123.123, 123.123"
            :value="`${mapPointB.x}, ${mapPointB.y}`"
            @change="
              e => {
                mapPointB = parseInput(e)
              }
            "
          />
          <span>游戏坐标：</span>
          <Input
            type="text"
            placeholder="123.123, 123.123"
            :value="`${realPointB.x}, ${realPointB.y}`"
            @change="
              e => {
                realPointB = parseInput(e)
              }
            "
          />
          <Button
            variant="solid"
            color="primary"
            @click="
              () => {
                mapPointB = { ...center.map }
              }
            "
          >
            更新
          </Button>
        </div>
      </div>
      <div>
        地图范围：[{{ bounds.start.x }}, {{ bounds.start.y }}] - [{{ bounds.end.x }}, {{ bounds.end.y }}] 比例：scaleX:
        {{ scaleX.toFixed(2) }} scaleY: {{ scaleY.toFixed(2) }}
      </div>
      <div>当前点位：[{{ center.map.x }},{{ center.map.y }}] 游戏：[{{ center.real.x }},{{ center.real.y }}]</div>
    </div>
  </div>
</template>
