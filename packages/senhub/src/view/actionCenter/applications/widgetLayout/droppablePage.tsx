import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import { Row, Col } from 'antd'

import './index.os.less'

/**
 * DroppablePage render as a Row
 */
const DroppablePage = ({
  index,
  items,
  children,
  disabled = false,
}: {
  index: number
  items: string[]
  children: ReactNode
  disabled?: boolean
}) => {
  const { setNodeRef } = useDroppable({
    id: `droppable-${index}`,
    data: { isDroppableZone: true, index },
    disabled,
  })

  return (
    <SortableContext items={items}>
      <Row id={`droppable-${index}`} gutter={[24, 24]} ref={setNodeRef}>
        <Col span={24}>
          <div className={`droppable-page ${disabled ? 'passive' : 'active'}`}>
            <Row gutter={[16, 16]}>{children}</Row>
          </div>
        </Col>
      </Row>
    </SortableContext>
  )
}

export default DroppablePage
