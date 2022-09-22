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

import { env } from 'shared/runtime'
import NetSwitch from 'view/actionCenter/settings/network/netSwitch'

const LIST_WALLET = {
  solflareWeb: <SolflareWeb />,
  solflareExt: <SolflareExtension />,
  clover: <CloverWallet />,
  exodus: <Exodus />,
  sollet: <SolletWeb />,
  slope: <Slope />,
  coin98: <Coin98 />,
  phantom: <Phantom />,
}

type WalletKey = keyof typeof LIST_WALLET

const SecureMethods = () => {
  const listWallet = useMemo(() => {
    const wallets: WalletKey[] = []

    let listWalletKey = Object.keys(LIST_WALLET) as WalletKey[]
    const { Slope, coin98, phantom, exodus, clover_solana, solflare } = window

    if (coin98) wallets.push('coin98')
    if (phantom) wallets.push('phantom')
    if (exodus) wallets.push('exodus')
    if (clover_solana) wallets.push('clover')
    if (Slope) wallets.push('slope')
    if (solflare) wallets.push('solflareExt')

    listWalletKey = listWalletKey.filter((val) => !wallets.includes(val))

    return wallets.concat(listWalletKey)
  }, [])

  return (
    <Row gutter={[12, 12]}>
      {listWallet.map((walletKey) => (
        <Col span={24} key={walletKey}>
          {LIST_WALLET[walletKey]}
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
