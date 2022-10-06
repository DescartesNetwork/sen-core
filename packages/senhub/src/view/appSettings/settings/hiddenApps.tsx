import { Col, Empty, Row, Typography } from 'antd'
import DroppablePage from '../appDraggable/droppablePage'
import DraggableIcon from '../appDraggable/draggableIcon'

import { ELEMENT_HIDDEN_ID } from './index'

export type HiddenAppProps = {
  hiddenAppIds: AppIds
  disabled?: boolean
  moveToSidebar?: (appId: string) => void
  removeFromSidebar?: (appId: string) => void
}
const HiddenApps = ({
  hiddenAppIds,
  disabled = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
}: HiddenAppProps) => {
  return (
    <DroppablePage id={ELEMENT_HIDDEN_ID} items={hiddenAppIds}>
      <Row gutter={[0, 8]} justify="center">
        <Col span={24}>
          <Typography.Text className="padding-x" type="secondary">
            NOT INCLUDES
          </Typography.Text>
        </Col>
        <Col span={24} /> {/* safe space */}
        {!hiddenAppIds.length ? (
          <Col>
            <Empty />
          </Col>
        ) : (
          hiddenAppIds.map((appId) => (
            <Col span={24} key={appId}>
              <DraggableIcon
                key={appId}
                appId={appId}
                disabled={disabled}
                size={32}
                moveToSidebar={() => moveToSidebar(appId)}
                removeFromSidebar={() => removeFromSidebar(appId)}
                hidden
              />
            </Col>
          ))
        )}
      </Row>
    </DroppablePage>
  )
}

export default HiddenApps
