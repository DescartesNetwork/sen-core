import { CSSProperties, Fragment, useEffect } from 'react'
import { account } from '@senswap/sen-js'

import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Login from './login'

import storage from 'shared/storage'
import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'os/store'
import {
  connectWallet,
  openWallet,
  disconnectWallet,
} from 'os/store/wallet.reducer'
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
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  const reconnect = () => {
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
  }

  useEffect(() => {
    if (account.isAddress(walletAddress)) return
    try {
      const wallet = reconnect()
      if (wallet) dispatch(connectWallet(wallet)).unwrap()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }, [dispatch, walletAddress])

  if (account.isAddress(walletAddress))
    return (
      <Button
        type="text"
        icon={<IonIcon name="power-outline" />}
        onClick={() => dispatch(disconnectWallet())}
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
