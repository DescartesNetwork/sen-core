import { useMemo } from 'react'

import { Avatar, Card, Col, Row, Space, Typography } from 'antd'
import WalletAction from './walletAction'

import { isAddress, shortenAddress } from 'shared/util'
import storage from 'shared/storage'
import { useWalletAddress } from 'hooks/useWallet'

import PHANTOM from 'static/images/wallet/phantom.png'
import SOLFLARE from 'static/images/wallet/solflare.png'
import SOLLET from 'static/images/wallet/sollet.png'
import SLOPE from 'static/images/wallet/slope.svg'
import COIN98 from 'static/images/wallet/coin98.png'
import CLOVER from 'static/images/wallet/clover.png'
import EXODUS from 'static/images/wallet/exodus.svg'

import './index.os.less'

const LOGO_WALLET: Record<string, string> = {
  Coin98: COIN98,
  Phantom: PHANTOM,
  SolletWeb: SOLLET,
  Slope: SLOPE,
  SolflareWeb: SOLFLARE,
  SolflareExtension: SOLFLARE,
  Clover: CLOVER,
  Exodus: EXODUS,
}

type WalletProfileProps = {
  onOpenActionCenter?: () => void
  visible?: boolean
  avatarSize?: number
  padding?: number
  sideBar?: boolean
}
const WalletProfile = ({
  onOpenActionCenter,
  visible = false,
  avatarSize = 32,
  padding = 0,
  sideBar = true,
}: WalletProfileProps) => {
  const walletAddress = useWalletAddress()

  const walletLogo = useMemo(() => {
    const walletType = storage.get('WalletType')
    return LOGO_WALLET[walletType]
  }, [])

  return (
    <Card
      bordered={false}
      style={{
        background: 'transparent',
        borderRadius: 12,
        boxShadow: 'unset',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding }}
      onClick={onOpenActionCenter}
    >
      <Row gutter={[12, 12]} align="middle" wrap={false}>
        <Col>
          <Avatar size={avatarSize}>
            {isAddress(walletAddress) && walletAddress.substring(0, 2)}
          </Avatar>
        </Col>
        {visible && (
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Space size={12}>
                {/* wallet address info */}
                <Space className={sideBar ? '' : 'wallet-address'}>
                  {!sideBar && <Avatar src={walletLogo} size={20} />}
                  <Typography.Text style={{ fontWeight: 600 }}>
                    {shortenAddress(walletAddress)}
                  </Typography.Text>
                </Space>

                {/* action */}
                <WalletAction />
              </Space>
              <Typography.Text style={{ color: '#F9575E' }}>
                Name
              </Typography.Text>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  )
}

export default WalletProfile
