import { useCallback, useState } from 'react'

import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Skeleton,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import WalletProfile from '../walletProfile'
import SolBalance from './solBalance'

import { RootDispatch, useRootDispatch } from 'store'
import { disconnectWallet, openWallet } from 'store/wallet.reducer'
import { logout } from 'store/user.reducer'
import { GuestWallet } from 'view/wallet/lib'

import LOGO_SOL from 'static/images/actionCenter/logo-solana.svg'

const WalletInfo = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const [hidden, setHidden] = useState(false)

  const onDisconnect = useCallback(async () => {
    const guestWallet = new GuestWallet(() => dispatch(openWallet()))
    await dispatch(logout())
    await dispatch(disconnectWallet(guestWallet))
  }, [dispatch])

  return (
    <Card bodyStyle={{ padding: 16 }} bordered={false} className="wallet-info">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <WalletProfile sideBar={false} visible={true} avatarSize={52} />
        </Col>
        <Col span={24}>
          <Row align="bottom">
            <Col flex="auto">
              <Space size={4} direction="vertical">
                <Space className="space-middle-icon">
                  <Avatar size={20} src={LOGO_SOL} shape="circle" />
                  <Typography.Text className="caption" type="secondary">
                    Sol balance
                  </Typography.Text>
                  <IonIcon
                    name={hidden ? 'eye-off-outline' : 'eye-outline'}
                    onClick={() => setHidden(!hidden)}
                    style={{ cursor: 'pointer' }}
                  />
                </Space>

                {hidden ? (
                  <Skeleton.Input
                    style={{ width: 56, borderRadius: 4 }}
                    size="small"
                    active
                  />
                ) : (
                  <Space size={4}>
                    <Typography.Title level={4}>
                      <SolBalance />
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      <SolBalance inUSD />
                    </Typography.Text>
                  </Space>
                )}
              </Space>
            </Col>
            <Col>
              <Button
                type="text"
                onClick={onDisconnect}
                icon={
                  <IonIcon style={{ fontSize: 24 }} name="log-out-outline" />
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default WalletInfo
