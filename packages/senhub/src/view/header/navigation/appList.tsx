import { useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'

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
import { setWalkthrough, WalkThroughType } from 'store/walkthrough.reducer'

import './index.os.less'

const STORE_ID = 'store'

const AppStore = () => {
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const run = useRootSelector((state: RootState) => state.walkthrough.run)
  const step = useRootSelector((state: RootState) => state.walkthrough.step)
  const dispatch = useRootDispatch<RootDispatch>()
  const onGoToApp = useGoToAppCallback()

  const onStore = useCallback(async () => {
    if (run && step === 0)
      await dispatch(
        setWalkthrough({ type: WalkThroughType.NewComer, step: 1 }),
      )
    return onGoToApp({ appId: STORE_ID })
  }, [dispatch, run, step, onGoToApp])

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
  return (
    <Row gutter={[12, 12]} wrap={false} align="middle">
      <Col id="store-nav-button">
        <AppStore />
      </Col>
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
    </Row>
  )
}

export default AppList
