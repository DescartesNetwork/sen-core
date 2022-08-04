import { useCallback, useEffect, useState } from 'react'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { getMint, MintsState } from 'store/mints.reducer'
import TokenProvider from 'shared/tokenProvider'
import { isAddress } from 'shared/util'

export const tokenProvider = new TokenProvider()

export const useMints = () => {
  const mints = useRootSelector((state: RootState) => state.mints)
  return mints
}

export const useMintData = ({
  mintAddress,
  force = false,
}: {
  mintAddress: string
  force?: boolean
}) => {
  const [mintData, setMintData] = useState<MintsState>()
  const dispatch = useRootDispatch<RootDispatch>()

  const getMintData = useCallback(async () => {
    if (!isAddress(mintAddress)) return setMintData(undefined)
    const data = await dispatch(
      getMint({ address: mintAddress, force }),
    ).unwrap()
    return setMintData(data)
  }, [dispatch, mintAddress, force])

  useEffect(() => {
    getMintData()
  }, [getMintData])

  return mintData
}

export const useMintDecimals = ({
  mintAddress,
  force = false,
}: {
  mintAddress: string
  force?: boolean
}) => {
  const [decimals, setDecimals] = useState<number>()
  const mintData = useMintData({ mintAddress, force })

  const getDecimals = useCallback(async () => {
    if (!isAddress(mintAddress)) return setDecimals(undefined)
    // If the token is in token provider, return its decimals
    if (!force) {
      const tokenInfo = await tokenProvider.findByAddress(mintAddress)
      if (tokenInfo?.decimals !== undefined)
        return setDecimals(tokenInfo.decimals)
    }
    // Fetch from the clusters
    if (mintData && mintData[mintAddress]?.decimals)
      return setDecimals(mintData[mintAddress].decimals)
    return setDecimals(undefined)
  }, [mintData, mintAddress, force])

  useEffect(() => {
    getDecimals()
  }, [getDecimals])

  console.log(decimals)
  return decimals
}
