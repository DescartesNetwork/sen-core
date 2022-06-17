import { useState } from 'react'

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

import { env } from 'shared/runtime'
import NetSwitch from 'os/view/actionCenter/settings/network/netSwitch'

const SecureMethods = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Coin98 />
      </Col>
      <Col span={24}>
        <Phantom />
      </Col>
      <Col span={24}>
        <SolletWeb />
      </Col>
      <Col span={24}>
        <Slope />
      </Col>
      <Col span={24}>
        <SolflareWeb />
      </Col>
      <Col span={24}>
        <SolflareExtension />
      </Col>
      <Col span={24}>
        <CloverWallet />
      </Col>
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
