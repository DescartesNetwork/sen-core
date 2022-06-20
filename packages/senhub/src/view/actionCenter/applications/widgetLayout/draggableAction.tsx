import { useSortable } from '@dnd-kit/sortable'
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
} from 'react'

/**
 * DraggableIcon render as a Col
 */
const DraggableAction = ({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) => {
  const { setNodeRef } = useSortable({ id })

  const ChildrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const childProps = { id, ref: setNodeRef }
      return cloneElement(child, childProps)
    }
    return child
  })

  return <Fragment>{ChildrenWithProps}</Fragment>
}

export default DraggableAction
