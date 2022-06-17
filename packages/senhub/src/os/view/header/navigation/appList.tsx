import { useRouteMatch } from 'react-router-dom'

import { Row, Col, Badge, Dropdown } from 'antd'
import AppIcon from 'os/components/appIcon'
import More from './more'
import ContextMenu from './contextMenu'

import { useRootSelector, RootState } from 'os/store'
import { useGoToAppCallback } from 'os/hooks/useGotoApp'

import './index.os.less'

const AppList = () => {
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const onGoToApp = useGoToAppCallback()

  return (
    <Row gutter={[12, 12]} wrap={false} align="middle">
      {appIds.map((appId) => (
        <Col key={appId}>
          <Dropdown
            trigger={['contextMenu']}
            overlay={<ContextMenu appId={appId} />}
            destroyPopupOnHide
          >
            <Badge
              dot={params?.appId === appId}
              className="sentre-active-app"
              offset={[-5, 5]}
            >
              <AppIcon
                appId={appId}
                size={32}
                name={false}
                onClick={() => onGoToApp({ appId })}
              />
            </Badge>
          </Dropdown>
        </Col>
      ))}
      <Col>
        <More />
      </Col>
    </Row>
  )
}

export default AppList
