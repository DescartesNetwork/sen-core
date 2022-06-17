import { Fragment, useCallback, useEffect } from 'react'
import { account } from '@senswap/sen-js'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'os/store'
import { getAccounts, upsetAccount } from 'os/store/accounts.reducer'

// Watch id
let watchId = 0
let prevLamports: BigInt | undefined = undefined

const AccountWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const lamports = useRootSelector((state: RootState) => state.wallet.lamports)

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      if (!account.isAddress(walletAddress)) return
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
    if (!account.isAddress(walletAddress))
      return console.warn('Wallet is not connected')
    if (watchId) return console.warn('Already watched')
    const { splt } = window.sentre || {}
    const filters = [{ memcmp: { bytes: walletAddress, offset: 32 } }]
    watchId = splt?.watch((er: string | null, re: any) => {
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
          await window.sentre.splt.unwatch(watchId)
        } catch (er) {}
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default AccountWatcher
