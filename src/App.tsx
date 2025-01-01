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
import { Button } from './components/button'
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
      className="bg-cover bg-center bg-[url('/maps/map_101.png')] absolute cursor-pointer"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <div className="relative w-full h-full"></div>
      {points?.map((point, index) => (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="absolute w-[32px] h-[32px] top-0 left-0"
          style={{
            transform: `translate3d(${realToMap(point).x - 16}px, ${realToMap(point).y - 16}px, 0)`,
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
      ))}
    </div>
  )
}

function App() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [runtimeOffset, setRuntimeOffset] = useState({ ...offset })
  const [rect, setRect] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const points = [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
    { x: 300, y: 300 },
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

  const scaleX = (realPointB!.x - realPointA!.x) / (mapPointB!.x - mapPointA!.x)
  const scaleY = (realPointB!.y - realPointA!.y) / (mapPointB!.y - mapPointA!.y)

  // 根据 点A 和 点B 的地图坐标和实际坐标，计算出实际坐标到地图坐标的映射关系
  const realToMap = ({ x, y }: Point) => {
    return {
      x: mapPointA!.x + (x - realPointA!.x) * scaleX,
      y: mapPointA!.y + (y - realPointA!.y) * scaleY,
    }
  }

  const mapToReal = ({ x, y }: Point) => {
    return {
      x: realPointA!.x + (x - mapPointA!.x) / scaleX,
      y: realPointA!.y + (y - mapPointA!.y) / scaleY,
    }
  }

  const centerPoint = useMemo(() => {
    const [w, h] = [rect.width / 2, rect.height / 2]
    const map = rect ? { x: runtimeOffset.x * -1 + w, y: runtimeOffset.y * -1 + h } : { x: 0, y: 0 }
    return {
      map: map,
      real: mapToReal(map),
    }
  }, [runtimeOffset, rect, mapToReal])

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
            <input
              type="text"
              placeholder="123.123, 123.123"
              value={`${mapPointA?.x}, ${mapPointA?.y}`}
              onChange={e => {
                setMapPointA(parseInput(e.target.value))
              }}
              className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500"
            />
            <span>游戏坐标：</span>
            <input
              type="text"
              placeholder="123.123, 123.123"
              value={`${realPointA?.x}, ${realPointA?.y}`}
              onChange={e => {
                setRealPointA(parseInput(e.target.value))
              }}
              className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500"
            />
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                setMapPointA({ ...centerPoint.map })
              }}
            >
              更新
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <span>地图坐标：</span>
            <input
              type="text"
              placeholder="123.123, 123.123"
              value={`${mapPointB?.x}, ${mapPointB?.y}`}
              onChange={e => {
                setMapPointB(parseInput(e.target.value))
              }}
              className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500"
            />
            <span>游戏坐标：</span>
            <input
              type="text"
              placeholder="123.123, 123.123"
              value={`${realPointB?.x}, ${realPointB?.y}`}
              onChange={e => {
                setRealPointB(parseInput(e.target.value))
              }}
              className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500"
            />
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                setMapPointB({ ...centerPoint.map })
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
          当前点位：[{centerPoint.map.x},{centerPoint.map.y}] 游戏：[{centerPoint.real.x},{centerPoint.real.y}]
        </div>
      </div>
    </div>
  )
}

export default App
