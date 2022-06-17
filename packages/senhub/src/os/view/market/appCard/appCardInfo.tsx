import { MouseEvent, useCallback, useMemo } from 'react'
import { account } from '@senswap/sen-js'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import AppIcon from 'os/components/appIcon'
import Verification from 'os/components/verification'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'os/store'
import { setWalkthrough, WalkThroughType } from 'os/store/walkthrough.reducer'
import { openWallet } from 'os/store/wallet.reducer'
import { setVisible } from 'os/store/search.reducer'
import { useGoToApp } from 'os/hooks/useGotoApp'
import { useInstallApp } from 'os/hooks/useInstallApp'

export type AppCardInfoProps = { appId: string }

const AppCardInfo = ({ appId }: AppCardInfoProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const register = useRootSelector((state: RootState) => state.page.register)
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const run = useRootSelector((state: RootState) => state.walkthrough.run)
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const visible = useRootSelector((state: RootState) => state.search.visible)
  const onInstallApp = useInstallApp(appId)
  const onGoToApp = useGoToApp({ appId })

  const { name, verified, author } = useMemo(
    () => register[appId] || ({} as ComponentManifest),
    [register, appId],
  )
  const installed = useMemo(() => appIds.includes(appId), [appIds, appId])

  const onInstall = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (!account.isAddress(walletAddress)) return dispatch(openWallet())
      if (run)
        await dispatch(
          setWalkthrough({ type: WalkThroughType.NewComer, step: 2 }),
        )
      return onInstallApp()
    },
    [onInstallApp, dispatch, run, walletAddress],
  )

  const onOpen = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (visible) await dispatch(setVisible(false))
      if (run)
        await dispatch(
          setWalkthrough({ type: WalkThroughType.NewComer, step: 3 }),
        )
      return onGoToApp()
    },
    [onGoToApp, dispatch, run, visible],
  )

  return (
    <Col span={24}>
      <Card
        bordered={false}
        className="glass"
        style={{
          borderRadius: 'unset',
        }}
        bodyStyle={{
          padding: '12px 16px',
        }}
      >
        <Row align="middle" gutter={[8, 8]} wrap={false}>
          <Col>
            <AppIcon size={32} appId={appId} name={false} />
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Space align="center" style={{ lineHeight: 1 }}>
                <Typography.Title level={5}>{name}</Typography.Title>
                <Verification verified={verified} />
              </Space>
              <Typography.Text type="secondary">{author?.name}</Typography.Text>
            </Space>
          </Col>
          <Col>
            {installed ? (
              <Button
                ghost
                size="small"
                onClick={onOpen}
                id="open-action-button"
              >
                Open
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={onInstall}
                size="small"
                id="install-action-button"
              >
                Install
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </Col>
  )
}

export default AppCardInfo
