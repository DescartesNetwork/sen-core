import { CSSProperties, Fragment, useCallback, useEffect } from 'react'

import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Login from './login'
import ActionCenter from 'view/actionCenter'

import {
  useRootDispatch,
  RootDispatch,
  useRootSelector,
  RootState,
} from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import storage from 'shared/storage'
import { isAddress } from 'shared/util'
import { connectWallet, openWallet } from 'store/wallet.reducer'
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
import { useInfix } from 'hooks/useUI'
import { Infix } from 'store/ui.reducer'

const Wallet = ({
  style = {},
  visible = false,
}: {
  style?: CSSProperties
  visible?: boolean
}) => {
  const infix = useInfix()
  const isMobile = infix < Infix.md
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()
  const visibleNavigation = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )

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
    return <ActionCenter visibleNavigation={visible} />
  return (
    <Fragment>
      <Button
        style={style}
        type="primary"
        icon={<IonIcon name="wallet-outline" />}
        onClick={() => dispatch(openWallet())}
      >
        {!isMobile && visibleNavigation && 'Connect Wallet'}
      </Button>
      <Login />
    </Fragment>
  )
}

export default Wallet
