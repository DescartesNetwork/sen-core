import { useCallback, useEffect, useState } from 'react'
import { net, storage } from '@sentre/senhub'

import { useAllMintAddresses } from './useAllMintAddresses'
import { useSortMints } from 'shared/hooks/useSortMints'

const LIMIT_ITEM = 8
const LOCAL_STORAGE_ID = `${net}:selected_mints`

export const useRecommendedMints = () => {
  const [recommendedMints, setRecommendedMints] = useState<string[]>([])
  const allMintAddresses = useAllMintAddresses()
  const { sortedMints } = useSortMints(allMintAddresses)

  const getRecommendedMints = useCallback(async () => {
    let mints: string[] = storage.get(LOCAL_STORAGE_ID) || []

    for (const mint of sortedMints) {
      if (mints.length >= LIMIT_ITEM) break
      if (mints.includes(mint)) continue
      mints.push(mint)
    }
    return setRecommendedMints(mints.slice(0, LIMIT_ITEM))
  }, [sortedMints])

  const addRecommendMint = useCallback(
    async (mintAddress: string) => {
      const mints = recommendedMints.filter((mint) => mint !== mintAddress)
      const newMints = [mintAddress, ...mints].slice(0, LIMIT_ITEM)
      storage.set(LOCAL_STORAGE_ID, newMints)

      return setRecommendedMints(newMints)
    },
    [recommendedMints],
  )

  useEffect(() => {
    getRecommendedMints()
  }, [getRecommendedMints])

  return {
    recommendedMints,
    addRecommendMint,
  }
}
