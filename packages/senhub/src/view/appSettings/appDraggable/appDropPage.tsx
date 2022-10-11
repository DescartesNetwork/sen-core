import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import './index.os.less'

/**
 * AppDropPage render as a Row
 */

export type AppDropPageProps = {
  index?: number
  items: string[]
  children: ReactNode
  disabled?: boolean
  id?: string
}

const AppDropPage = ({
  index = 0,
  items,
  children,
  disabled = false,
  id = '',
}: AppDropPageProps) => {
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

export default AppDropPage
