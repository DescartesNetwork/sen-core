import { useCallback } from 'react'
import { account } from '@senswap/sen-js'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { installApp } from 'store/page.reducer'
import { openWallet } from 'store/wallet.reducer'
import { updateVisited } from 'store/flags.reducer'

export const useInstallAppCallback = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  const onInstallCallback = useCallback(
    async (appId: string) => {
      if (!account.isAddress(walletAddress)) return dispatch(openWallet())
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
