import { useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Card } from 'antd'
import AppIcon from 'components/appIcon'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { RootState, useRootSelector } from 'store'

const STORE_ID = 'store'

const SenMarket = () => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()

  const onStore = useCallback(async () => {
    return onGoToApp({ appId: STORE_ID })
  }, [onGoToApp])

  const cardAppCln =
    params?.appId === STORE_ID ? 'card-app-icon active' : 'card-app-icon'

  return (
    <Card bordered={false} className={cardAppCln}>
      <AppIcon
        appId={STORE_ID}
        size={32}
        direction="horizontal"
        name={visible}
        onClick={onStore}
      />
    </Card>
  )
}
export default SenMarket
