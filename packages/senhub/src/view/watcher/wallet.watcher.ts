import { useEffect, useCallback } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import { updateWallet } from 'store/wallet.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

// Watch id
let watchId = 0

const WalletWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const watchData = useCallback(async () => {
    if (!isAddress(walletAddress))
      return console.warn('Wallet is not connected')
    if (watchId) return console.warn('Already watched')
    watchId =
      window.sentre.lamports.watch(
        walletAddress,
        (er: string | null, re: number | null) => {
          if (er) return console.warn(er)
          return dispatch(updateWallet({ lamports: BigInt(re || 0) }))
        },
      ) || 0
  }, [dispatch, walletAddress])

  useEffect(() => {
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await window.sentre.splt.unwatch(watchId)
        } catch (er) {
          // Do nothing
        }
      })()
      watchId = 0
    }
  }, [watchData])

  return null
}

export default WalletWatcher
