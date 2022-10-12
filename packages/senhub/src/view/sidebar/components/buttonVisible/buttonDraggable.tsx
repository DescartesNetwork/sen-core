import { CSSProperties, useMemo, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { setVisibleNagivation } from 'store/ui.reducer'
import DraggableItem from 'components/dndkitContainer/draggableItem'

export const BTN_ID = 'action_btn_sidebar_id'

const ICON_BACK_NAME = 'chevron-back-outline'
const ICON_FORWARD_NAME = 'chevron-forward-outline'
const ICON_POSITION = {
  right: {
    back: ICON_BACK_NAME,
    forward: ICON_FORWARD_NAME,
  },
  left: {
    back: ICON_FORWARD_NAME,
    forward: ICON_BACK_NAME,
  },
}
const RADIUS = {
  right: '0 8px 8px 0',
  left: '8px 0 0 8px',
}

export type ButtonDraggableProps = {
  style?: CSSProperties
  disabled?: boolean
  y: number
}
const ButtonDraggable = ({
  style,
  disabled = false,
  y,
}: ButtonDraggableProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const sidebarPosition = useRootSelector(
    (state: RootState) => state.ui.sidebarPosition,
  )
  const dispatch = useRootDispatch<RootDispatch>()

  const btnPosition = sidebarPosition === 'right' ? 'left' : 'right'
  const btnName = useMemo(
    () =>
      visible
        ? ICON_POSITION[btnPosition].back
        : ICON_POSITION[btnPosition].forward,
    [btnPosition, visible],
  )

  const defaultStyle = {
    top: y,
    [btnPosition]: -24,
  }

  return (
    <DraggableItem
      id="draggable_btn_id"
      disabled={disabled}
      style={{
        position: 'absolute',
        background: 'transparent',
        padding: 0,
        width: 32,
        ...style,
        ...defaultStyle,
      }}
      onDragging={setIsDragging}
    >
      <Button
        id={BTN_ID}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          borderRadius: RADIUS[btnPosition],
        }}
        className="btn-visible-sidebar"
        icon={<IonIcon name={btnName} />}
        onClick={() => dispatch(setVisibleNagivation(!visible))}
      />
    </DraggableItem>
  )
}

export default ButtonDraggable
