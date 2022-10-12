import { CSSProperties, ReactNode, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'

import { CSS } from '@dnd-kit/utilities'

/**
 * DraggableItem render as a Col
 */

export type DraggableItemProps = {
  id: string
  disabled?: boolean
  children?: ReactNode
  style?: CSSProperties
  onDragging?: (isDragging: boolean) => void
}

const DraggableItem = ({
  id,
  disabled = false,
  children,
  style,
  onDragging = () => {},
}: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled,
    })

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
  }

  useEffect(() => {
    onDragging(isDragging)
  }, [isDragging, onDragging])

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

export default DraggableItem
