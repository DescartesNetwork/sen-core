import { Row, Col, Dropdown, Card, Tooltip } from 'antd'
import AppIcon from 'components/appIcon'
import ContextMenu from './contextMenu'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { useAppIds, useCurrentAppId } from 'hooks/useAppIds'
import { useAppName } from 'hooks/useAppName'

export type AppListProps = { visible?: boolean }

const AppList = ({ visible = false }: AppListProps) => {
  const appIds = useAppIds()
  const currentAppId = useCurrentAppId()
  const onGoToApp = useGoToAppCallback()
  const getAppName = useAppName()

  return (
    <Row gutter={[4, 4]}>
      {appIds.map((appId) => (
        <Col span={24} key={appId}>
          <Dropdown
            trigger={['contextMenu']}
            overlay={<ContextMenu appId={appId} />}
            destroyPopupOnHide
          >
            <Tooltip
              trigger={visible ? [] : ['hover']}
              arrowPointAtCenter
              title={getAppName(appId)}
              placement="right"
            >
              <Card
                bordered={false}
                className={
                  currentAppId === appId
                    ? 'card-app-icon active'
                    : 'card-app-icon'
                }
                onClick={() => onGoToApp({ appId })}
              >
                <AppIcon
                  appId={appId}
                  size={32}
                  direction="horizontal"
                  name={visible}
                />
              </Card>
            </Tooltip>
          </Dropdown>
        </Col>
      ))}
    </Row>
  )
}

export default AppList
