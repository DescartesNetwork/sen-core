import { useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Card } from 'antd'
import AppIcon from 'components/appIcon'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { RootState, useRootSelector } from 'store'

const STORE_ID = 'store'

type SenMarketProps = { isMobile?: boolean }
const SenMarket = ({ isMobile }: SenMarketProps) => {
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()

  const nextVisible = useMemo(() => {
    if (!isMobile) return visible
    return false
  }, [isMobile, visible])

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
        name={nextVisible}
        onClick={onStore}
      />
    </Card>
  )
}
export default SenMarket