import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import { Row, Col, Space, Typography, Dropdown, Empty, Button } from 'antd'
import SortableItem from './sortableItem'
import AppIcon from 'components/appIcon'
import IonIcon from '@sentre/antd-ionicon'
import AppActions from '../appActions'

export type ListAppProps = {
  id?: string
  items: AppIds
  moveToSidebar?: (appId: string) => void
  removeFromSidebar?: (appId: string) => void
  activeId?: string
}
const ListApp = ({
  items,
  id = '',
  activeId = '',
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
}: ListAppProps) => {
  const { setNodeRef } = useDroppable({
    id,
  })

  const cln = items.length
    ? 'build-droppable-page'
    : 'build-droppable-page drag-empty'

  return (
    <SortableContext id={id} items={items}>
      <div className={cln} ref={setNodeRef}>
        <Row
          gutter={[0, 8]}
          style={{ height: '100%' }}
          justify="center"
          ref={setNodeRef}
        >
          <Col span={24}>
            <Typography.Text className="padding-x" type="secondary">
              {id === 'appIds' ? 'IN SIDEBAR' : 'NOT INCLUDES'}
            </Typography.Text>
          </Col>
          <Col span={24} />
          {!items.length && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                zIndex: 0,
                bottom: 0,
              }}
            >
              <Empty imageStyle={{ height: 32 }} style={{ fontSize: 10 }} />
            </div>
          )}
          {items.map((id) => (
            <SortableItem key={id} id={id} active={activeId === id}>
              <AppIcon appId={id} size={32} direction="horizontal" />
              <Space>
                <Dropdown
                  className="draggable-dropdown"
                  trigger={['click']}
                  overlay={
                    <AppActions
                      appId={id}
                      moveToSidebar={() => moveToSidebar(id)}
                      removeFromSidebar={() => removeFromSidebar(id)}
                    />
                  }
                  destroyPopupOnHide
                >
                  <Button
                    type="text"
                    icon={<IonIcon name="ellipsis-horizontal" />}
                  />
                </Dropdown>
                <Button
                  type="text"
                  icon={<IonIcon name="menu-outline" />}
                  onClick={() => {}}
                />
              </Space>
            </SortableItem>
          ))}
        </Row>
      </div>
    </SortableContext>
  )
}

export default ListApp
