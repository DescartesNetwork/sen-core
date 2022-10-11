import { Fragment, useCallback, useEffect } from 'react'

import { isAddress } from 'shared/util'
import { useRootDispatch, RootDispatch } from 'store'
import { getAccounts, upsetAccount } from 'store/accounts.reducer'
import { useWalletAddress, useWalletBalance } from 'hooks/useWallet'
import { splt } from 'store/mints.reducer'

// Watch id
let watchId = 0
let prevLamports: number | undefined = undefined

const AccountWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()
  const lamports = useWalletBalance()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      if (!isAddress(walletAddress)) return
      await dispatch(getAccounts({ owner: walletAddress })).unwrap()
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch data of accounts',
      })
    }
  }, [dispatch, walletAddress])
  // Watch account changes
  const watchData = useCallback(async () => {
    if (!isAddress(walletAddress))
      return console.warn('Wallet is not connected')
    if (watchId) return console.warn('Already watched')
    const filters = [{ memcmp: { bytes: walletAddress, offset: 32 } }]
    watchId = splt.watch((er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetAccount({ address, data }))
    }, filters)
  }, [dispatch, walletAddress])

  // When we close accounts, there a high chance
  // that the next balance will be greater than the current balance
  // We use this trick to reload relevant list
  useEffect(() => {
    if (typeof prevLamports !== 'undefined' && lamports > prevLamports) {
      dispatch(getAccounts({ owner: walletAddress }))
    }
    prevLamports = lamports
  }, [dispatch, walletAddress, lamports])

  useEffect(() => {
    fetchData()
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await splt.unwatch(watchId)
        } catch (er) {
          // Do nothing
        }
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default AccountWatcher
