import { CSSProperties, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Col, Row } from 'antd'

import './sortableItem.os.less'

export type SortableItemProps = {
  id?: string
  children?: ReactNode
  style?: CSSProperties
  disabled?: boolean
}

const SortableItem = ({
  id = '',
  children,
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

  return (
    <Row
      gutter={[0, 8]}
      ref={setNodeRef}
      className="card-draggable-item"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : undefined,
        position: 'relative',
      }}
      {...attributes}
      {...listeners}
    >
      <Col span={24}>{children}</Col>
    </Row>
  )
}

export default SortableItem
