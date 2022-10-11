import { Col, Empty, Row, Typography } from 'antd'
import AppDropPage from '../appDraggable/appDropPage'
import AppSortItem from '../appDraggable/appSortItem'

import { ELEMENT_HIDDEN_ID } from './index'

export type HiddenAppProps = {
  hiddenAppIds: AppIds
  disabled?: boolean
  moveToSidebar?: (appId: string) => void
  removeFromSidebar?: (appId: string) => void
  activeId?: string
}
const HiddenApps = ({
  hiddenAppIds,
  disabled = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
  activeId,
}: HiddenAppProps) => {
  return (
    <AppDropPage id={ELEMENT_HIDDEN_ID} items={hiddenAppIds}>
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
              <AppSortItem
                key={appId}
                appId={appId}
                disabled={disabled}
                size={32}
                moveToSidebar={() => moveToSidebar(appId)}
                removeFromSidebar={() => removeFromSidebar(appId)}
                hidden
                active={appId === activeId}
              />
            </Col>
          ))
        )}
      </Row>
    </AppDropPage>
  )
}

export default HiddenApps
