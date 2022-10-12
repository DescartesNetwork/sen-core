import IonIcon from '@sentre/antd-ionicon'
import { Button, Dropdown, Space } from 'antd'
import AppIcon from 'components/appIcon'
import SortbleItem from 'components/dndkitContainer/sortableItem'
import AppActions, { AppActionsProps } from '../appActions'

/**
 * AppSortItem render as a Col
 */

export type AppSortItemProps = {
  appId: string
  size?: number
  disabled?: boolean
  moveToSidebar?: AppActionsProps['moveToSidebar']
  removeFromSidebar?: AppActionsProps['removeFromSidebar']
  hidden?: boolean
  active?: boolean
}

const AppSortItem = ({
  appId,
  size = 32,
  disabled = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
  hidden = false,
  active,
}: AppSortItemProps) => {
  const style = {
    opacity: active ? 0.5 : 1,
  }

  return (
    <SortbleItem id={appId} style={style} disabled={disabled}>
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
    </SortbleItem>
  )
}

export default AppSortItem
