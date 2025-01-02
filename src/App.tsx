import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Button, Input } from './components'
import { useLocalStorageState, useToggle } from 'ahooks'
import { toInt, toNumber, trim } from 'kotl'

type Point = {
  x: number
  y: number
}

function Map({
  offset,
  rect,
  points,
  size,
  realToMap,
}: {
  rect?: DOMRect
  offset: Point
  points: Point[]
  size: number
  realToMap: (realPoint: Point) => Point
}) {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable({
    id: 'map',
  })

  const style = transform
    ? {
        transform: `translate3d(${offset.x + transform.x}px, ${offset.y + transform.y}px, 0)`,
        width: `${size}px`,
        height: `${size}px`,
      }
    : {
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        width: `${size}px`,
        height: `${size}px`,
      }

  return (
    <div
      className="bg-cover bg-center bg-[url('/maps/map_101.webp')] absolute cursor-pointer"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <div className="relative w-full h-full"></div>
      {points?.map((point, index) => {
        const p = realToMap(point)
        console.log(p)
        return (
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="absolute w-[32px] h-[32px] top-0 left-0"
            style={{
              transform: `translate3d(${p.x - 16}px, ${p.y - 16}px, 0)`,
            }}
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
        )
      })}
    </div>
  )
}

function App() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [runtimeOffset, setRuntimeOffset] = useState({ ...offset })
  const [rect, setRect] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  // -- [Lua] X:-16078.579406 Y:23212.450274 Z:1631.473150
  // -- [Lua] RebirthPoint_HFS_C_9 翠竹林-后山

  // -- [Lua] AActor: 0000000B87CF6118
  // -- [Lua] X:1300.232300 Y:64355.234375 Z:975.849121
  // -- [Lua] RebirthPoint_HFS_C_7 翠竹林-白雾泽

  // -- [Lua] AActor: 0000000B87CF8618
  // -- [Lua] X:-425.251923 Y:54947.250000 Z:1205.412804
  // -- [Lua] RebirthPoint_HFS_C_6 翠竹林-蛇径

  // -- [Lua] AActor: 0000000B87CF7418
  // -- [Lua] X:1321.775513 Y:11999.843750 Z:1121.336426
  // -- [Lua] RebirthPoint_HFS_C_5 苍狼林-观音禅院

  // -- [Lua] AActor: 0000000B87CF6918
  // -- [Lua] X:-63974.664062 Y:28486.105469 Z:8101.832031
  // -- [Lua] RebirthPoint_HFS_C_4 黑风洞-见谛峰

  // -- [Lua] AActor: 0000000B87CF8018
  // -- [Lua] X:-35111.868485 Y:18220.894028 Z:-921.253999
  // -- [Lua] RebirthPoint_HFS_C_3 苍狼林-前山

  // -- [Lua] AActor: 0000000B87CF5518
  // -- [Lua] X:-62018.049156 Y:64197.804950 Z:-1762.951053
  // -- [Lua] RebirthPoint_HFS_C_2 黑风洞-洞内

  // -- [Lua] AActor: 0000000B87CF5618
  // -- [Lua] X:-85214.835862 Y:59839.779841 Z:-192.969867
  // -- [Lua] RebirthPoint_HFS_C_11 黑风洞-洞外

  // -- [Lua] AActor: 0000000B87CF5718
  // -- [Lua] X:3002.896729 Y:-14980.264648 Z:4516.431152
  // -- [Lua] RebirthPoint_HFS_C_1 苍狼林-林外

  // -- [Lua] AActor: 0000000B87CF6A18
  // -- [Lua] X:-59216.141769 Y:20820.697949 Z:-2223.647438
  // -- [Lua] BP_RebirthPointZhaoHunFanBase_C_1 招魂幡

  const points = [
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
  ]

  const [mapPointA, setMapPointA] = useLocalStorageState('MapPointA', {
    defaultValue: { x: 0, y: 0 },
  })
  const [realPointA, setRealPointA] = useLocalStorageState('RealPointA', {
    defaultValue: { x: 0, y: 0 },
  })
  const [mapPointB, setMapPointB] = useLocalStorageState('MapPointB', {
    defaultValue: { x: 100, y: 100 },
  })
  const [realPointB, setRealPointB] = useLocalStorageState('RealPointB', {
    defaultValue: { x: 100, y: 100 },
  })

  // const scaleX = (realPointB!.x - realPointA!.x) / (mapPointB!.x - mapPointA!.x)
  // const scaleY = (realPointB!.y - realPointA!.y) / (mapPointB!.y - mapPointA!.y)
  const scaleX = 56
  const scaleY = 56

  // 根据 点A 和 点B 的地图坐标和实际坐标，计算出实际坐标到地图坐标的映射关系
  const realToMap = ({ x, y }: Point) => {
    const xStr = (mapPointA!.x + (x - realPointA!.x) / scaleX).toFixed(2)
    const yStr = (mapPointA!.y + (y - realPointA!.y) / scaleY).toFixed(2)
    console.log(`mapPointA.x：${mapPointA!.x} realPointA.x：${realPointA!.x} scaleX：${scaleX}`)
    console.log(`mapPointA.y：${mapPointA!.y} realPointA.y：${realPointA!.y} scaleY：${scaleY}`)
    console.log(`realToMap: ${x}, ${y} -> ${xStr}, ${yStr}`)
    return {
      x: toNumber(xStr)!,
      y: toNumber(yStr)!,
    }
  }

  const mapToReal = ({ x, y }: Point) => {
    return {
      x: realPointA!.x + (x - mapPointA!.x) * scaleX,
      y: realPointA!.y + (y - mapPointA!.y) * scaleY,
    }
  }

  const centerPoint = () => {
    const [w, h] = [rect.width / 2, rect.height / 2]
    const map = rect ? { x: runtimeOffset.x * -1 + w, y: runtimeOffset.y * -1 + h } : { x: 0, y: 0 }
    return {
      map: map,
      real: mapToReal(map),
    }
  }

  const parseInput = (input: string = '') => {
    const [x, y] = input.split(',').map(v => toNumber(trim(v), 0))
    return { x: x ?? 0, y: y ?? 0 }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.id === 'map') {
      setOffset(runtimeOffset)
    }
  }
  const handleDragMove = (event: DragMoveEvent) => {
    if (event.active.id === 'map') {
      const { x, y } = event.delta
      setRuntimeOffset({ x: offset.x + x, y: offset.y + y })
    }
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (offset) {
      if (event.key === 'ArrowUp') {
        const val = { ...offset, y: toInt(offset.y)! - 1 }
        setRuntimeOffset(val)
        setOffset(val)
      }
      if (event.key === 'ArrowDown') {
        const val = { ...offset, y: toInt(offset.y)! + 1 }
        setRuntimeOffset(val)
        setOffset(val)
      }
      if (event.key === 'ArrowLeft') {
        const val = { ...offset, x: toInt(offset.x)! - 1 }
        setRuntimeOffset(val)
        setOffset(val)
      }
      if (event.key === 'ArrowRight') {
        const val = { ...offset, x: toInt(offset.x)! + 1 }
        setRuntimeOffset(val)
        setOffset(val)
      }
    }
  }
  const mapBounds = {
    start: mapToReal({ x: 0, y: 0 }),
    end: mapToReal({ x: 4096, y: 4096 }),
  }

  const [isShowMap, { toggle }] = useToggle()

  useEffect(() => {
    if (mapRef.current) {
      setRect(mapRef.current.getBoundingClientRect())
    }
  }, [mapRef.current])

  const center = centerPoint()
  return (
    <div className="w-screen h-screen flex" onKeyDown={handleKeyDown}>
      <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
        <div ref={mapRef} className="w-[100vh] h-[100vh] overflow-hidden relative">
          <Map
            size={4096}
            offset={offset}
            rect={mapRef.current?.getBoundingClientRect()}
            points={points}
            realToMap={realToMap}
          ></Map>
          {/* 十字准星 */}
          <div className="absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="text-red-500 w-12 h-12"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M501.028571 343.771429h7.314286v164.571428H343.771429v-7.314286H0v21.942858h343.771429v-7.314286h164.571428V680.228571h-7.314286v343.771429h21.942858V680.228571h-7.314286V515.657143H680.228571v7.314286h343.771429v-21.942858H680.228571v7.314286H515.657143V343.771429h7.314286V0h-21.942858v343.771429z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </DndContext>
      <div className="flex-1 h-screen p-4 gap-4 flex flex-col">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span>地图坐标：</span>
            <Input
              type="text"
              placeholder="123.123, 123.123"
              value={`${mapPointA?.x}, ${mapPointA?.y}`}
              onChange={e => {
                setMapPointA(parseInput(e.target.value))
              }}
            />
            <span>游戏坐标：</span>
            <Input
              type="text"
              placeholder="123.123, 123.123"
              value={`${realPointA?.x}, ${realPointA?.y}`}
              onChange={e => {
                setRealPointA(parseInput(e.target.value))
              }}
            />
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                setMapPointA({ ...center.map })
              }}
            >
              更新
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <span>地图坐标：</span>
            <Input
              type="text"
              placeholder="123.123, 123.123"
              value={`${mapPointB?.x}, ${mapPointB?.y}`}
              onChange={e => {
                setMapPointB(parseInput(e.target.value))
              }}
            />
            <span>游戏坐标：</span>
            <Input
              type="text"
              placeholder="123.123, 123.123"
              value={`${realPointB?.x}, ${realPointB?.y}`}
              onChange={e => {
                setRealPointB(parseInput(e.target.value))
              }}
            />
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                setMapPointB({ ...center.map })
              }}
            >
              更新
            </Button>
          </div>
        </div>
        <div>
          地图范围：[{mapBounds.start.x}, {mapBounds.start.y}] - [{mapBounds.end.x}, {mapBounds.end.y}] 比例：scaleX:{' '}
          {scaleX.toFixed(2)} scaleY: {scaleY.toFixed(2)}
        </div>
        <div>
          当前点位：[{center.map.x},{center.map.y}] 游戏：[{center.real.x},{center.real.y}]
        </div>
      </div>
    </div>
  )
}

export default App
