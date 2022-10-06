import { useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Row, Col, Dropdown, Card } from 'antd'
import AppIcon from 'components/appIcon'
import ContextMenu from './contextMenu'

import { RootState, useRootSelector } from 'store'
import { useGoToAppCallback } from 'hooks/useGotoApp'
import { useAppIds } from 'hooks/useAppIds'

import './index.os.less'

export type AppListProps = { visible?: boolean }

const AppList = ({ visible = false }: AppListProps) => {
  const appIds = useAppIds()
  const hiddenAppIds = useRootSelector(
    (state: RootState) => state.page.hiddenAppIds,
  )

  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()

  const filteredAppIds = useMemo(() => {
    if (!hiddenAppIds.length) return appIds

    const nextAppIds: AppIds = []
    for (const appId of appIds) {
      if (hiddenAppIds.includes(appId)) continue
      nextAppIds.push(appId)
    }
    return nextAppIds
  }, [appIds, hiddenAppIds])

  return (
    <Row>
      {filteredAppIds.map((appId) => {
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
