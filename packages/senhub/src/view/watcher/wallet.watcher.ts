import { useEffect, useCallback } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import { updateWallet } from 'store/wallet.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

// Watch id
let watchId: any = null

const WalletWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const watchData = useCallback(async () => {
    if (!isAddress(walletAddress)) {
      try {
        await window.sentre.lamports.unwatch(watchId)
      } catch (er) {
        /* Nothing */
      }
      watchId = null
    } else {
      if (watchId) return console.warn('Already watched')
      watchId = window.sentre.lamports.watch(
        walletAddress,
        (er: string | null, re: number | null) => {
          if (er) return console.warn(er)
          return dispatch(updateWallet({ lamports: BigInt(re || 0) }))
        },
      )
    }
  }, [dispatch, walletAddress])

  useEffect(() => {
    watchData()
  }, [watchData])

  return null
}

export default WalletWatcher
