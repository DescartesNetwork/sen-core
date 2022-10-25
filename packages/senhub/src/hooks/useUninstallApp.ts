import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { RootDispatch, useRootDispatch } from 'store'
import { uninstallApp } from 'store/user.reducer'
import { openWallet } from 'store/wallet.reducer'
import { useWalletAddress } from './useWallet'
import { isAddress } from 'shared/util'

export const useUninstallAppCallback = () => {
  const history = useHistory()
  const dispatch = useRootDispatch<RootDispatch>()
  const { pathname } = useLocation()
  const walletAddress = useWalletAddress()

  const onUninstallCallback = useCallback(
    async (appId: string) => {
      if (!isAddress(walletAddress)) return dispatch(openWallet())
      await dispatch(uninstallApp(appId))
      if (pathname.startsWith(`/app/${appId}`)) return history.push('/welcome')
    },
    [dispatch, walletAddress, pathname, history],
  )

  return onUninstallCallback
}

export const useUninstallApp = (appId: string) => {
  const onUninstallCallback = useUninstallAppCallback()
  const onUninstallApp = useCallback(async () => {
    return onUninstallCallback(appId)
  }, [onUninstallCallback, appId])

  return onUninstallApp
}
