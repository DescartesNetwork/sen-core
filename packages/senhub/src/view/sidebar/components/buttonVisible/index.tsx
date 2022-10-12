import { useState } from 'react'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'

import { DndContext } from '@dnd-kit/core'
import DraggableButton from './draggableButton'

const activationConstraint = { distance: 1 }

const ButtonVisibleSideBar = () => {
  const [y, setY] = useState(16)
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      sensors={sensors}
      onDragEnd={({ delta }) => setY((y) => y - delta.y)}
    >
      <DraggableButton initialY={y} />
    </DndContext>
  )
}

export default ButtonVisibleSideBar
