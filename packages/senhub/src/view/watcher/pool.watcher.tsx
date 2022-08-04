import { Fragment, useCallback, useEffect } from 'react'

import { useRootDispatch, RootDispatch } from 'store'
import { getPools, upsetPool } from 'store/pools.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import configs from 'configs'

const {
  sol: { taxmanAddress },
} = configs

// Watch id
let watchId = 0

const PoolWatcher = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      if (!isAddress(walletAddress)) return
      await dispatch(getPools()).unwrap()
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch data of pools',
      })
    }
  }, [dispatch, walletAddress])
  // Watch account changes
  const watchData = useCallback(async () => {
    if (watchId) return console.warn('Already watched')
    const { swap } = window.sentre || {}
    const filters = [{ memcmp: { bytes: taxmanAddress, offset: 65 } }]
    watchId = swap?.watch((er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetPool({ address, data }))
    }, filters)
  }, [dispatch])

  useEffect(() => {
    fetchData()
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await window.sentre.swap.unwatch(watchId)
        } catch (er) {
          // Do nothing
        }
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default PoolWatcher
