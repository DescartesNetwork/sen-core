import { useMemo, useState } from 'react'

import { Row, Col, Tooltip, Switch, Typography, Divider, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Coin98 from './coin98'
import Phantom from './phantom'
import Slope from './slope'
import SolflareExtension from './solflareExt'
import SolflareWeb from './solflareWeb'
import SolletWeb from './solletWeb'
import KeyStore from './keystore'
import SecretKey from './secretKey'
import CloverWallet from './clover'
import Exodus from './exodus'
import NetSwitch from 'view/actionCenter/settings/network/netSwitch'

import { env } from 'shared/runtime'

const LIST_WALLET = [
  { key: 'coin98', component: Coin98, priority: 1 },
  { key: 'phantom', component: Phantom, priority: 2 },
  { key: 'exodus', component: Exodus, priority: 3 },
  { key: 'clover_solana', component: CloverWallet, priority: 4 },
  { key: 'solflare', component: SolflareExtension, priority: 5 },
  { key: 'solflareWeb', component: SolflareWeb, priority: 6 },
  { key: 'solletWeb', component: SolletWeb, priority: 7 },
  { key: 'Slope', component: Slope, priority: 8 },
]

const SecureMethods = () => {
  const sortedWallet = useMemo(
    () =>
      LIST_WALLET.sort((a: any, b: any) => {
        if (window?.[a.key] && !window?.[b.key]) return -1
        if (!window?.[a.key] && window?.[b.key]) return 1
        return a.priority - b.priority
      }),
    [],
  )

  return (
    <Row gutter={[12, 12]}>
      {sortedWallet.map((wallet) => (
        <Col span={24} key={wallet.key}>
          <wallet.component />
        </Col>
      ))}
    </Row>
  )
}

const UnsecureMethods = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Typography.Text>
          These connections are for development only. Because other applications
          can read your secret data including private keys, you shouldn't
          connect by any mainnet wallet.
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: '0px 0px 8px 0px' }} />
      </Col>
      <Col span={24}>
        <KeyStore />
      </Col>
      <Col span={24}>
        <SecretKey />
      </Col>
    </Row>
  )
}

const WalletConnection = () => {
  const [advanced, setAdvanced] = useState(false)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space>
          <Typography.Title level={5}>Wallet Connection</Typography.Title>
          <Divider type="vertical" />
          <NetSwitch />
          {env === 'production' ? null : (
            <Space>
              <Divider type="vertical" />
              <Typography.Text>Dev Only</Typography.Text>
              <Tooltip title="Caution! These methods is not recommended due to lack of cryptographical protection. By switching the button, you agree that you will use this function at your own risk.">
                <Switch
                  size="small"
                  checked={advanced}
                  onChange={setAdvanced}
                  checkedChildren={<IonIcon name="warning" />}
                  unCheckedChildren={<IonIcon name="help-circle" />}
                />
              </Tooltip>
            </Space>
          )}
        </Space>
      </Col>
      <Col span={24}>{advanced ? <UnsecureMethods /> : <SecureMethods />}</Col>
    </Row>
  )
}

export default WalletConnection
