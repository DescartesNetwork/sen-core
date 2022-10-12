import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

/**
 * DroppablePage render as a Row
 */

export type DroppablePageProps = {
  index?: number
  items: string[]
  children: ReactNode
  disabled?: boolean
  id?: string
}

const DroppablePage = ({
  index = 0,
  items,
  children,
  disabled = false,
  id = '',
}: DroppablePageProps) => {
  const rowId = id.length ? id : `droppable-${index}`
  const { setNodeRef } = useDroppable({
    id: rowId,
    data: { isDroppableZone: true, index },
    disabled,
  })

  return (
    <SortableContext items={items}>
      <div id={rowId} ref={setNodeRef}>
        {children}
      </div>
    </SortableContext>
  )
}

export default DroppablePage
