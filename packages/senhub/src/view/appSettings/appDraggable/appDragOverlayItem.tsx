import { Fragment } from 'react'

import AppIcon from 'components/appIcon'
import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import DraggableOverlay from 'components/dndkitContainer/draggableOverlay'

export type AppDragOverlayItemProps = { activeId: string; size?: number }
const AppDragOverlayItem = ({
  activeId,
  size = 32,
}: AppDragOverlayItemProps) => {
  if (!activeId) return <Fragment />

  return (
    <DraggableOverlay>
      <div className="card-draggable-item" id={`draggale-${activeId}`}>
        <AppIcon appId={activeId} size={size} direction="horizontal" />
        <Button
          type="text"
          icon={<IonIcon name="menu-outline" />}
          onClick={() => {}}
        />
      </div>
    </DraggableOverlay>
  )
}

export default AppDragOverlayItem
