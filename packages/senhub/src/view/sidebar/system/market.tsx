import { useCallback, useMemo } from 'react'

import { Card, Tooltip } from 'antd'
import AppIcon from 'components/appIcon'

import { useGoToAppCallback } from 'hooks/useGotoApp'
import { RootState, useRootSelector } from 'store'
import { useAppName } from 'hooks/useAppName'
import { useCurrentAppId } from 'hooks/useAppIds'

const STORE_ID = 'store'

export type SenMarketProps = { isMobile?: boolean }

const SenMarket = ({ isMobile }: SenMarketProps) => {
  const visible = useRootSelector(({ ui }: RootState) => ui.visibleNavigation)
  const currentAppId = useCurrentAppId()
  const onGoToApp = useGoToAppCallback()
  const getAppName = useAppName()

  const nextVisible = useMemo(() => !isMobile && visible, [isMobile, visible])

  const onStore = useCallback(async () => {
    return onGoToApp({ appId: STORE_ID })
  }, [onGoToApp])

  return (
    <Tooltip
      trigger={!nextVisible ? ['hover'] : []}
      arrowPointAtCenter
      title={getAppName(STORE_ID)}
      placement="right"
    >
      <Card
        bordered={false}
        className={
          currentAppId === STORE_ID ? 'card-app-icon active' : 'card-app-icon'
        }
        onClick={onStore}
      >
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
