import { useCallback, useEffect, useState } from 'react'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { getMint, MintsState } from 'store/mints.reducer'
import TokenProvider, {
  BalansolTokenProvider,
  SenLpTokenProvider,
  SplTokenProvider,
} from 'shared/tokenProvider'
import { isAddress } from 'shared/util'

export const tokenProvider = new TokenProvider([
  new SplTokenProvider(),
  new BalansolTokenProvider(),
  new SenLpTokenProvider(),
])

export const useMints = () => {
  const mints = useRootSelector((state: RootState) => state.mints)
  return mints
}

export const useMintSelector = <T>(selector: (mints: MintsState) => T) => {
  const data = useRootSelector((state: RootState) => selector(state.mints))
  return data
}

/**
 * Get mint data
 */

export type GetMintDataProps = {
  mintAddress: string
  force?: boolean
}

export const useGetMintData = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const getMintData = useCallback(
    async ({ mintAddress, force = false }: GetMintDataProps) => {
      if (!isAddress(mintAddress)) return undefined
      try {
        return await dispatch(getMint({ address: mintAddress, force })).unwrap()
      } catch (er: any) {
        window.notify({ type: 'warning', description: er.message })
        return undefined
      }
    },
    [dispatch],
  )

  return getMintData
}

export const useMintData = ({
  mintAddress,
  force = false,
}: GetMintDataProps) => {
  const [mintData, setMintData] = useState<MintsState>()
  const _getMintData = useGetMintData()

  const getMintData = useCallback(async () => {
    const mintData = await _getMintData({ mintAddress, force })
    return setMintData(mintData)
  }, [_getMintData, mintAddress, force])

  useEffect(() => {
    getMintData()
  }, [getMintData])

  return mintData
}

/**
 * Get mint decimals
 */

export type GetMintDecimalsProps = {
  mintAddress: string
  force?: boolean
}

export const useGetMintDecimals = () => {
  const getMintData = useGetMintData()

  const getDecimals = useCallback(
    async ({ mintAddress, force = false }: GetMintDecimalsProps) => {
      if (!isAddress(mintAddress)) return undefined
      // If the token is in token provider, return its decimals
      if (!force) {
        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        if (tokenInfo?.decimals !== undefined) return tokenInfo.decimals
      }
      // Fetch from the clusters
      const mintData = await getMintData({ mintAddress })
      if (mintData && mintData[mintAddress]?.decimals)
        return mintData[mintAddress].decimals
      return undefined
    },
    [getMintData],
  )

  return getDecimals
}

export const useMintDecimals = ({
  mintAddress,
  force = false,
}: GetMintDecimalsProps) => {
  const [decimals, setDecimals] = useState<number>()
  const getMintDecimals = useGetMintDecimals()

  const getDecimals = useCallback(async () => {
    const decimals = await getMintDecimals({
      mintAddress,
      force,
    })
    return setDecimals(decimals)
  }, [force, getMintDecimals, mintAddress])

  useEffect(() => {
    getDecimals()
  }, [getDecimals])

  return decimals
}
