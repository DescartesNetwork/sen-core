import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { account } from '@senswap/sen-js'

import { RootDispatch, RootState, useRootSelector } from 'store'
import { getMint, MintsState } from 'store/mints.reducer'
import TokenProvider from 'shared/tokenProvider'

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
  const dispatch = useDispatch<RootDispatch>()

  const getMintData = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setMintData(undefined)
    const data = await dispatch(
      getMint({ address: mintAddress, force }),
    ).unwrap()
    return setMintData(data)
  }, [dispatch])

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
  const mintData = useMintData({ mintAddress })

  const getDecimals = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setDecimals(undefined)
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
  }, [mintData])

  useEffect(() => {
    getDecimals()
  }, [getDecimals])

  return decimals
}
