import { Fragment } from 'react'

import AppIcon from 'components/appIcon'
import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { DragOverlay } from '@dnd-kit/core'

export type DragOverlayItemProps = { activeId: string; size?: number }

const DragOverlayItem = ({ activeId, size = 32 }: DragOverlayItemProps) => {
  if (!activeId) return <Fragment />

  return (
    <DragOverlay>
      <div className="card-draggable-item" id={`draggale-${activeId}`}>
        <AppIcon appId={activeId} size={size} direction="horizontal" />
        <Button
          type="text"
          icon={<IonIcon name="menu-outline" />}
          onClick={() => {}}
        />
      </div>
    </DragOverlay>
  )
}

export default DragOverlayItem
