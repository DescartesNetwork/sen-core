import { useCallback, useMemo } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { Card, Tooltip } from 'antd'
import AppIcon from 'components/appIcon'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { RootState, useRootSelector } from 'store'
import { useAppName } from 'hooks/useAppName'

const STORE_ID = 'store'

export type SenMarketProps = { isMobile?: boolean }

const SenMarket = ({ isMobile }: SenMarketProps) => {
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const { params } = useRouteMatch<{ appId: string }>('/app/:appId') || {}
  const onGoToApp = useGoToAppCallback()
  const getAppName = useAppName()

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
    <Tooltip
      trigger={!nextVisible ? ['hover'] : []}
      arrowPointAtCenter
      title={getAppName(STORE_ID)}
      placement="right"
    >
      <Card bordered={false} className={cardAppCln} onClick={onStore}>
        <AppIcon
          appId={STORE_ID}
          size={32}
          direction="horizontal"
          name={nextVisible}
        />
      </Card>
    </Tooltip>
  )
}
export default SenMarket
