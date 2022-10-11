import { CSSProperties, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import classNames from 'classnames'

import { CSS } from '@dnd-kit/utilities'
import moduleCss from './draggable.module.css'

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

  console.log(
    id,
    listeners,
    CSS.Transform,
    transform,
    'CSS.Transform.toString(transform)',
  )

  const cln = classNames(
    moduleCss.Draggable,
    dragOverlay && moduleCss.dragOverlay,
    dragging && moduleCss.dragging,
    handle && moduleCss.handle,
  )

  return (
    <div
      className={`card-draggable-item ${cln}`}
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
