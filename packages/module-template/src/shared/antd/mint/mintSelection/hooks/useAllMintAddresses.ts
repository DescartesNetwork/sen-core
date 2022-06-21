import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@sentre/senhub'

export const useAllMintAddresses = () => {
  const [allMintAddresses, setAllMintAddresses] = useState<string[]>([])
  const { tokenProvider } = useMint()

  const getRecommendedMintAddresses = useCallback(async () => {
    const allMintAddresses = (await tokenProvider.all()).map(
      ({ address }) => address,
    )
    const addresses = allMintAddresses.filter((mintAddress) =>
      allMintAddresses.includes(mintAddress),
    )
    return setAllMintAddresses(addresses)
  }, [tokenProvider])

  useEffect(() => {
    getRecommendedMintAddresses()
  }, [getRecommendedMintAddresses])

  return allMintAddresses
}
