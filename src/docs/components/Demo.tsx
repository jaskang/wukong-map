import type { ReactNode } from 'react'

export function Demo(props: { children: ReactNode }) {
  return <div className="flex items-center gap-2">{props.children}</div>
}
