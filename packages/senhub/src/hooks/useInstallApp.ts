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
import { setWalkthrough, WalkThroughType } from 'store/walkthrough.reducer'

export const useInstallAppCallback = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const run = useRootSelector((state: RootState) => state.walkthrough.run)

  const onInstallCallback = useCallback(
    async (appId: string) => {
      if (!account.isAddress(walletAddress)) return dispatch(openWallet())
      await dispatch(updateVisited(true))
      dispatch(installApp(appId))
      if (run)
        await dispatch(
          setWalkthrough({ type: WalkThroughType.NewComer, step: 2 }),
        )
    },
    [dispatch, walletAddress, run],
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
