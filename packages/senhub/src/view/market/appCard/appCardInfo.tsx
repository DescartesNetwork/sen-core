import { MouseEvent, useCallback, useMemo } from 'react'
import { account } from '@senswap/sen-js'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import AppIcon from 'components/appIcon'
import Verification from 'components/verification'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import { openWallet } from 'store/wallet.reducer'
import { useGoToApp } from 'hooks/useGotoApp'
import { useInstallApp } from 'hooks/useInstallApp'

export type AppCardInfoProps = { appId: string }

const AppCardInfo = ({ appId }: AppCardInfoProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const register = useRootSelector((state: RootState) => state.page.register)
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
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

      return onInstallApp()
    },
    [onInstallApp, dispatch, walletAddress],
  )

  const onOpen = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onGoToApp()
    },
    [onGoToApp, dispatch],
  )

  return (
    <Card
      bordered={false}
      className="glass"
      style={{
        // Don't remove the border-radius bottom because -webkit- properties not working with overflow hidden.
        borderTopRightRadius: 'unset',
        borderTopLeftRadius: 'unset',
        boxShadow: 'unset',
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
            <Button ghost size="small" onClick={onOpen}>
              Open
            </Button>
          ) : (
            <Button type="primary" onClick={onInstall} size="small">
              Install
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  )
}

export default AppCardInfo
