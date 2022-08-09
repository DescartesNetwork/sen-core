import { useCallback, useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { getMint, MintData } from 'store/mints.reducer'
import TokenProvider from 'shared/tokenProvider'
import { isAddress } from 'shared/util'

type Address = string | PublicKey

export const tokenProvider = new TokenProvider()

export const useMints = () => {
  const mints = useRootSelector((state: RootState) => state.mints)
  return mints
}

export const useGetMintData = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const getMintData = useCallback(
    async ({
      mintAddress,
      force = false,
    }: {
      mintAddress: Address
      force?: boolean
    }) => {
      if (!isAddress(mintAddress.toString())) return undefined
      try {
        const data = await dispatch(
          getMint({ address: mintAddress.toString(), force }),
        ).unwrap()
        return data[mintAddress.toString()]
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
}: {
  mintAddress: string
  force?: boolean
}) => {
  const [mintData, setMintData] = useState<MintData>()
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

export const useGetMintDecimals = () => {
  const getMintData = useGetMintData()

  const getDecimals = useCallback(
    async (mintAddress: Address) => {
      if (!isAddress(mintAddress.toString())) return undefined
      // If the token is in token provider, return its decimals
      const tokenInfo = await tokenProvider.findByAddress(mintAddress)
      if (tokenInfo?.decimals !== undefined) return tokenInfo.decimals
      // Fetch from the clusters
      const mintData = await getMintData({ mintAddress })
      if (mintData) return mintData.decimals
      return undefined
    },
    [getMintData],
  )

  return getDecimals
}

export const useMintDecimals = (mintAddress: Address) => {
  const [decimals, setDecimals] = useState<number>()
  const getMintDecimals = useGetMintDecimals()

  const getDecimals = useCallback(async () => {
    const decimals = await getMintDecimals(mintAddress)
    return setDecimals(decimals)
  }, [getMintDecimals, mintAddress])

  useEffect(() => {
    getDecimals()
  }, [getDecimals])

  return decimals
}
