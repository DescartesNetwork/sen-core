import { Col, Empty, Row, Typography } from 'antd'
import { useAppIds } from 'hooks/useAppIds'
import DraggableIcon from '../appDraggable/draggableIcon'
import DroppablePage from '../appDraggable/droppablePage'

import { ELEMENT_INSIDE_ID } from './index'

export type ShowedAppsProps = {
  appIds: AppIds
  disabled?: boolean
  moveToSidebar?: (appId: string) => void
  removeFromSidebar?: (appId: string) => void
}
const ShowedApps = ({
  appIds,
  disabled = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
}: ShowedAppsProps) => {
  const allAppIds = useAppIds()
  return (
    <DroppablePage id={ELEMENT_INSIDE_ID} items={allAppIds} disabled={disabled}>
      <Row gutter={[0, 8]} justify="center">
        <Col span={24}>
          <Typography.Text className="padding-x" type="secondary">
            IN SIDEBAR
          </Typography.Text>
        </Col>
        <Col span={24} /> {/* safe space */}
        {!appIds.length ? (
          <Col>
            <Empty />
          </Col>
        ) : (
          appIds.map((appId) => (
            <Col span={24} key={appId}>
              <DraggableIcon
                key={appId}
                appId={appId}
                disabled={disabled}
                size={32}
                moveToSidebar={() => moveToSidebar(appId)}
                removeFromSidebar={() => removeFromSidebar(appId)}
              />
            </Col>
          ))
        )}
      </Row>
    </DroppablePage>
  )
}

export default ShowedApps
