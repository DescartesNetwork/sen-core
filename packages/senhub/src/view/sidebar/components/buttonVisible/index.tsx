import { useState } from 'react'

import ButtonDraggable from './buttonDraggable'
import DraggableContext from 'components/dndkitContainer'

const DEFAULT_POSITION = 80

const ButtonVisibleSideBar = () => {
  const [posY, setPosY] = useState(DEFAULT_POSITION)

  return (
    <DraggableContext
      onDragEnd={({ delta }) => setPosY((prevY) => delta.y + prevY)}
      activationConstraint={{ delay: 200, tolerance: 5 }}
    >
      <ButtonDraggable y={posY} />
    </DraggableContext>
  )
}

export default ButtonVisibleSideBar
