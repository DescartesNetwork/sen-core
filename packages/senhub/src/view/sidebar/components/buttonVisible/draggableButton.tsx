import { useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { setVisibleNagivation } from 'store/ui.reducer'

import './index.os.less'

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

export type DraggableButtonProps = {
  initialY?: number
}

const DraggableButton = ({ initialY = 16 }: DraggableButtonProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'button_visible_sidebar',
  })
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const sidebarPosition = useRootSelector(
    (state: RootState) => state.ui.sidebarPosition,
  )
  const dispatch = useRootDispatch<RootDispatch>()

  const btnPosition = useMemo(
    () => (sidebarPosition === 'right' ? 'left' : 'right'),
    [sidebarPosition],
  )
  const btnIcon = useMemo(
    () =>
      visible
        ? ICON_POSITION[btnPosition].back
        : ICON_POSITION[btnPosition].forward,
    [btnPosition, visible],
  )

  return (
    <Button
      style={{
        transform: CSS.Translate.toString(transform),
        [btnPosition]: -24,
        bottom: initialY,
        borderRadius: 8,
      }}
      className="btn-visible-sidebar"
      icon={<IonIcon name={btnIcon} />}
      onClick={() => dispatch(setVisibleNagivation(!visible))}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    />
  )
}

export default DraggableButton
