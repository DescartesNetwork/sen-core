import { useRouteMatch } from 'react-router-dom'

import { Row, Col, Dropdown, Card } from 'antd'
import AppIcon from 'components/appIcon'
import ContextMenu from './contextMenu'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { useAppIds } from 'hooks/useAppIds'

import './index.os.less'

type AppListProps = { visible?: boolean }
const AppList = ({ visible = false }: AppListProps) => {
  const appIds = useAppIds()

  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()

  return (
    <Row>
      {appIds.map((appId) => {
        const cardAppCln =
          params?.appId === appId ? 'card-app-icon active' : 'card-app-icon'

        return (
          <Col span={24} key={appId}>
            <Dropdown
              trigger={['contextMenu']}
              overlay={<ContextMenu appId={appId} />}
              destroyPopupOnHide
            >
              <Card bordered={false} className={cardAppCln}>
                <AppIcon
                  appId={appId}
                  size={32}
                  direction="horizontal"
                  name={visible}
                  onClick={() => onGoToApp({ appId })}
                />
              </Card>
            </Dropdown>
          </Col>
        )
      })}
    </Row>
  )
}

export default AppList
