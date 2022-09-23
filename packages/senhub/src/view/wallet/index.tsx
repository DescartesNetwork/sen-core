import { CSSProperties, Fragment, useCallback, useEffect } from 'react'

import { Avatar, Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Login from './login'

import { useRootDispatch, RootDispatch } from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import storage from 'shared/storage'
import { isAddress, shortenAddress } from 'shared/util'
import {
  connectWallet,
  openWallet,
  disconnectWallet,
} from 'store/wallet.reducer'
import { logout } from 'store/user.reducer'
import {
  Coin98Wallet,
  PhantomWallet,
  SecretKeyWallet,
  SolletWallet,
  SlopeWallet,
  SolflareWebWallet,
  SolflareExtensionWallet,
  CloverWallet,
  ExodusWallet,
} from './lib'

const Wallet = ({ style = {} }: { style?: CSSProperties }) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const reconnect = useCallback(() => {
    const walletType = storage.get('WalletType')
    switch (walletType) {
      case 'SecretKey':
        return new SecretKeyWallet(SecretKeyWallet.getSecretKey())
      case 'Keystore':
        return new SecretKeyWallet(SecretKeyWallet.getSecretKey())
      case 'Coin98':
        return new Coin98Wallet()
      case 'Phantom':
        return new PhantomWallet()
      case 'SolletWeb':
        return new SolletWallet()
      case 'Slope':
        return new SlopeWallet()
      case 'SolflareWeb':
        return new SolflareWebWallet()
      case 'SolflareExtension':
        return new SolflareExtensionWallet()
      case 'Clover':
        return new CloverWallet()
      case 'Exodus':
        return new ExodusWallet()
      default:
        return undefined
    }
  }, [])

  const disconnect = useCallback(async () => {
    await dispatch(logout())
    await dispatch(disconnectWallet())
  }, [dispatch])

  useEffect(() => {
    if (isAddress(walletAddress)) return
    try {
      const wallet = reconnect()
      if (wallet) dispatch(connectWallet(wallet)).unwrap()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }, [dispatch, reconnect, walletAddress])

  if (isAddress(walletAddress))
    return (
      <Card
        bordered={false}
        style={{ background: 'transparent', borderRadius: 12 }}
        bodyStyle={{ padding: 8 }}
      >
        <Row gutter={[12, 12]} align="middle" wrap={false}>
          <Col>
            <Avatar size={32} />
          </Col>
          <Col flex="auto">
            <Space align="start">
              <Space direction="vertical" size={0}>
                <Typography.Text style={{ fontWeight: 600 }}>
                  {shortenAddress(walletAddress)}
                </Typography.Text>
                <Typography.Text type="secondary" onClick={disconnect}>
                  Name
                </Typography.Text>
              </Space>
              <Button type="text" icon={<IonIcon name="copy-outline" />} />
              <Button type="text" icon={<IonIcon name="qr-code-outline" />} />
            </Space>
          </Col>
        </Row>
      </Card>
    )
  return (
    <Fragment>
      <Button
        style={style}
        type="primary"
        icon={<IonIcon name="wallet-outline" />}
        onClick={() => dispatch(openWallet())}
      >
        Connect Wallet
      </Button>
      <Login />
    </Fragment>
  )
}

export default Wallet
