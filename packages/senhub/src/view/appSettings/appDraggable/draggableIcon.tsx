import IonIcon from '@sentre/antd-ionicon'
import { Button, Dropdown, Space } from 'antd'
import AppIcon from 'components/appIcon'
import AppActions, { AppActionsProps } from '../appActions'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * DraggableIcon render as a Col
 */

export type DraggableIconProps = {
  appId: string
  size?: number
  disabled?: boolean
  moveToSidebar?: AppActionsProps['moveToSidebar']
  removeFromSidebar?: AppActionsProps['removeFromSidebar']
  hidden?: boolean
}

const DraggableIcon = ({
  appId,
  size = 32,
  disabled = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
  hidden = false,
}: DraggableIconProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: appId,
      disabled,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition,
  }

  return (
    <div
      className="card-draggable-item"
      id={`draggale-${appId}`}
      style={style}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <AppIcon appId={appId} size={size} direction="horizontal" />
      <Space>
        <Dropdown
          className="draggable-dropdown"
          trigger={['click']}
          overlay={
            <AppActions
              appId={appId}
              moveToSidebar={moveToSidebar}
              removeFromSidebar={removeFromSidebar}
              hidden={hidden}
            />
          }
          destroyPopupOnHide
        >
          <Button type="text" icon={<IonIcon name="ellipsis-horizontal" />} />
        </Dropdown>
        <Button
          type="text"
          icon={<IonIcon name="menu-outline" />}
          onClick={() => {}}
        />
      </Space>
    </div>
  )
}

export default DraggableIcon
