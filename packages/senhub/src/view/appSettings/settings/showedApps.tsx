import { Col, Empty, Row, Typography } from 'antd'
import AppDropPage from '../appDraggable/appDropPage'
import AppSortItem from '../appDraggable/appSortItem'

import { ELEMENT_INSIDE_ID } from './index'

export type ShowedAppsProps = {
  appIds: AppIds
  disabled?: boolean
  moveToSidebar?: (appId: string) => void
  removeFromSidebar?: (appId: string) => void
  activeId?: string
}
const ShowedApps = ({
  appIds,
  disabled = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
  activeId,
}: ShowedAppsProps) => {
  return (
    <AppDropPage id={ELEMENT_INSIDE_ID} items={appIds} disabled={disabled}>
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
              <AppSortItem
                key={appId}
                appId={appId}
                disabled={disabled}
                size={32}
                moveToSidebar={() => moveToSidebar(appId)}
                removeFromSidebar={() => removeFromSidebar(appId)}
                active={appId === activeId}
              />
            </Col>
          ))
        )}
      </Row>
    </AppDropPage>
  )
}

export default ShowedApps
