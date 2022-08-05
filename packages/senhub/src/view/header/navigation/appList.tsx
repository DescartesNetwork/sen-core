import { Fragment, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Row, Col, Badge, Dropdown, Divider } from 'antd'
import AppIcon from 'components/appIcon'
import More from './more'
import ContextMenu from './contextMenu'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { useAppIds } from 'hooks/useAppIds'
import { useWalletAddress } from 'hooks/useWallet'
import { isAddress } from 'shared/util'

import './index.os.less'

const STORE_ID = 'store'

const AppStore = () => {
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()

  const onStore = useCallback(async () => {
    return onGoToApp({ appId: STORE_ID })
  }, [onGoToApp])

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
  const appIds = useAppIds()

  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()
  const walletAddress = useWalletAddress()

  return (
    <Row gutter={[12, 12]} wrap={false} align="middle">
      <Col>
        <AppStore />
      </Col>
      {isAddress(walletAddress) && (
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
