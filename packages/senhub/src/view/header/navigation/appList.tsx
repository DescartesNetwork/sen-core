import { Fragment, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Badge, Dropdown, Divider } from 'antd'
import AppIcon from 'components/appIcon'
import More from './more'
import ContextMenu from './contextMenu'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import { useGoToAppCallback } from 'hooks/useGotoApp'

import './index.os.less'

const STORE_ID = 'store'

const AppStore = () => {
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const dispatch = useRootDispatch<RootDispatch>()
  const onGoToApp = useGoToAppCallback()

  const onStore = useCallback(async () => {
    return onGoToApp({ appId: STORE_ID })
  }, [dispatch, onGoToApp])

  return (
    <Badge
      dot={params?.appId === STORE_ID}
      className="sentre-active-app"
      offset={[-5, 5]}
    >
      <AppIcon appId={STORE_ID} size={32} name={false} onClick={onStore} />
    </Badge>
  )
}

const AppList = () => {
  const appIds = useRootSelector((state: RootState) => state.page.appIds)

  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  return (
    <Row gutter={[12, 12]} wrap={false} align="middle">
      <Col id="store-nav-button">
        <AppStore />
      </Col>
      {account.isAddress(walletAddress) && (
        <Fragment>
          <Divider type="vertical" />
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
        </Fragment>
      )}
    </Row>
  )
}

export default AppList
