import { CSSProperties, Fragment, useCallback, useEffect } from 'react'

import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Login from './login'

import { useRootDispatch, RootDispatch } from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import storage from 'shared/storage'
import { isAddress } from 'shared/util'
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
      default:
        return undefined
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap()
      await dispatch(disconnectWallet()).unwrap()
    } catch (er: any) {
      return console.warn(er.message)
    }
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
      <Button
        type="text"
        icon={<IonIcon name="power-outline" />}
        onClick={disconnect}
        style={{
          color: '#E9E9EB',
          padding: 0,
          background: 'transparent',
          height: 'auto',
          ...style,
        }}
      >
        Disconnect
      </Button>
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
