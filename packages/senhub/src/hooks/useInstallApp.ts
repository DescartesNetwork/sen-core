import { useCallback } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import { installApp } from 'store/page.reducer'
import { openWallet } from 'store/wallet.reducer'
import { updateVisited } from 'store/flags.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from './useWallet'

export const useInstallAppCallback = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const onInstallCallback = useCallback(
    async (appId: string) => {
      if (!isAddress(walletAddress)) return dispatch(openWallet())
      await dispatch(updateVisited(true))
      return dispatch(installApp(appId))
    },
    [dispatch, walletAddress],
  )

  return onInstallCallback
}

export const useInstallApp = (appId: string) => {
  const onInstallAppCallback = useInstallAppCallback()
  const onInstallApp = useCallback(async () => {
    return onInstallAppCallback(appId)
  }, [onInstallAppCallback, appId])

  return onInstallApp
}
