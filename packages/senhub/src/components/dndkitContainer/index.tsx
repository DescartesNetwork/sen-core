import { ReactNode } from 'react'
import {
  closestCorners,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerActivationConstraint,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

// Mixed Strategy
const mixedStrategy = (
  ...args: Parameters<typeof rectIntersection | typeof closestCorners>
) => {
  const intersecting = rectIntersection(...args)
  return intersecting ? intersecting : closestCorners(...args)
}

export type DraggableContextProps = {
  onDragStart?: (e: DragStartEvent) => void
  onDragOver?: (e: DragOverEvent) => void
  onDragEnd?: (e: DragEndEvent) => void
  onDragCancel?: (e: DragCancelEvent) => void
  onDragMove?: (e: DragMoveEvent) => void
  children?: ReactNode
  activationConstraint?: PointerActivationConstraint
}
const DraggableContext = ({
  onDragStart = () => {},
  onDragOver = () => {},
  onDragEnd = () => {},
  children,
  onDragCancel = () => {},
  onDragMove = () => {},
  activationConstraint,
}: DraggableContextProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  })

  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={mixedStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      onDragMove={onDragMove}
    >
      {children}
    </DndContext>
  )
}

export default DraggableContext
