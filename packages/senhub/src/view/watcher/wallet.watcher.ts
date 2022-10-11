import { useEffect, useCallback } from 'react'
import { web3 } from '@project-serum/anchor'

import { useRootDispatch, RootDispatch } from 'store'
import { updateWallet } from 'store/wallet.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { connection } from 'providers/sol.provider'

const WalletWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const watchData = useCallback(() => {
    if (!isAddress(walletAddress)) return () => {}
    const walletPublicKey = new web3.PublicKey(walletAddress)
    const watchId = connection.onAccountChange(
      walletPublicKey,
      ({ lamports }) => {
        return dispatch(updateWallet({ lamports }))
      },
    )
    return () => connection.removeAccountChangeListener(watchId)
  }, [dispatch, walletAddress])

  useEffect(() => {
    const unwatch = watchData()
    return unwatch
  }, [watchData])

  return null
}

export default WalletWatcher
