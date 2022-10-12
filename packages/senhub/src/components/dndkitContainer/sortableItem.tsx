import { CSSProperties, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

/**
 * SortbleItem render as a Col
 */

export type SortbleItemProps = {
  id: string
  disabled?: boolean
  children?: ReactNode
  style?: CSSProperties
  dragOverlay?: boolean
  dragging?: boolean
  handle?: boolean
}

const SortbleItem = ({
  id,
  dragOverlay,
  dragging,
  handle,
  disabled = false,
  children,
  style,
}: SortbleItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id,
    disabled,
  })

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div
      className="card-draggable-item"
      id={`draggale-${id}`}
      style={{ ...style, ...itemStyle }}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export default SortbleItem
