import { CSSProperties, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export type SortableItemProps = {
  id?: string
  children?: ReactNode
  center?: boolean
  active?: boolean
  style?: CSSProperties
  disabled?: boolean
}
const SortableItem = ({
  id = '',
  children,
  center = false,
  active = false,
  style,
  disabled = false,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const defaultStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging && active ? 999 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        justifyContent: center ? 'center' : 'space-between',
        ...defaultStyle,
        ...style,
      }}
      className="card-draggable-item"
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

export default SortableItem
