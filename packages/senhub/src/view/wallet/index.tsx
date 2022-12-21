import { CSSProperties, Fragment, useCallback, useEffect, useMemo } from 'react'

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
import { useGuestMode, useWalletAddress } from 'hooks/useWallet'
import storage from 'shared/storage'
import { isAddress } from 'shared/util'
import { connectWallet, openWallet } from 'store/wallet.reducer'
import {
  Coin98Wallet,
  PhantomWallet,
  SecretKeyWallet,
  SolflareWebWallet,
  SolflareExtensionWallet,
  CloverWallet,
  ExodusWallet,
  GuestWallet,
} from './lib'
import { useInfix } from 'hooks/useUI'
import { Infix } from 'store/ui.reducer'

export type WalletProps = {
  style?: CSSProperties
  visible?: boolean
}

const Wallet = ({ style = {}, visible = false }: WalletProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const visibleNavigation = useRootSelector(
    ({ ui }: RootState) => ui.visibleNavigation,
  )
  const walletAddress = useWalletAddress()
  const infix = useInfix()
  const guestMode = useGuestMode()

  const isMobile = useMemo(() => infix < Infix.md, [infix])

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
      case 'SolflareWeb':
        return new SolflareWebWallet()
      case 'SolflareExtension':
        return new SolflareExtensionWallet()
      case 'Clover':
        return new CloverWallet()
      case 'Exodus':
        return new ExodusWallet()
      default:
        if (guestMode) return new GuestWallet(() => dispatch(openWallet()))
        return undefined
    }
  }, [dispatch, guestMode])

  useEffect(() => {
    if (isAddress(walletAddress)) return
    try {
      const wallet = reconnect()
      if (wallet) dispatch(connectWallet(wallet)).unwrap()
    } catch (er: any) {
      window.notify({ type: 'error', description: er.message })
    }
  }, [dispatch, reconnect, walletAddress])

  return (
    <Fragment>
      {isAddress(walletAddress) ? (
        <ActionCenter visibleNavigation={visible} />
      ) : (
        <Button
          style={style}
          type="primary"
          icon={<IonIcon name="wallet-outline" />}
          onClick={() => dispatch(openWallet())}
          block={!isMobile && visibleNavigation}
        >
          {!isMobile && visibleNavigation && 'Connect Wallet'}
        </Button>
      )}
      <Login />
    </Fragment>
  )
}

export default Wallet
