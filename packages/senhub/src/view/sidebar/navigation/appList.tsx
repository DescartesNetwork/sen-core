import { useParams } from 'react-router-dom'

import { Row, Col, Dropdown, Card } from 'antd'
import AppIcon from 'components/appIcon'
import ContextMenu from './contextMenu'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { useAppIds } from 'hooks/useAppIds'

import './index.os.less'

export type AppListProps = { visible?: boolean }

const AppList = ({ visible = false }: AppListProps) => {
  const appIds = useAppIds()

  const { appId: currentAppId } = useParams<{ appId: string }>() || {}
  const onGoToApp = useGoToAppCallback()

  return (
    <Row>
      {appIds.map((appId) => (
        <Col span={24} key={appId}>
          <Dropdown
            trigger={['contextMenu']}
            overlay={<ContextMenu appId={appId} />}
            destroyPopupOnHide
          >
            <Card
              bordered={false}
              className={
                currentAppId === appId
                  ? 'card-app-icon active'
                  : 'card-app-icon'
              }
            >
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
      ))}
    </Row>
  )
}

export default AppList
