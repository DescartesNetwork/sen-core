import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Row, Col, Space, Dropdown, Empty, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AppIcon from 'components/appIcon'
import SortableItem from './sortableItem'
import AppActions from '../appActions'

export type ListAppProps = {
  items: AppIds
}

const ListApp = ({ items }: ListAppProps) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <Row gutter={[0, 8]} justify="center">
        {!items.length && (
          <Col span={24}>
            <Row gutter={[0, 8]} justify="center">
              <Col>
                <Empty />
              </Col>
            </Row>
          </Col>
        )}
        {items.map((id) => (
          <Col span={24} key={id}>
            <SortableItem id={id}>
              <Row gutter={[0, 8]} wrap={false} align="middle">
                <Col flex="auto">
                  <AppIcon appId={id} size={32} direction="horizontal" />
                </Col>
                <Col>
                  <Space>
                    <Dropdown
                      className="draggable-dropdown"
                      trigger={['click']}
                      overlay={<AppActions appId={id} />}
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
                </Col>
              </Row>
            </SortableItem>
          </Col>
        ))}
      </Row>
    </SortableContext>
  )
}

export default ListApp
