import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@sentre/senhub'

export const useSortMints = (mints: string[]) => {
  const [sortedMints, setSortedMints] = useState<string[]>([])
  const { accounts } = useAccount()

  const mapMintAmounts = useMemo(() => {
    const mapMints: Record<string, number> = {}
    for (const account of Object.values(accounts)) {
      mapMints[account.mint] = Number(account.amount.toString())
    }
    return mapMints
  }, [accounts])

  const sortMints = useCallback(
    async (mintAddresses: string[]) => {
      const sortedMints = mintAddresses.sort((a, b) => {
        let amountA = mapMintAmounts[a] || -1
        let amountB = mapMintAmounts[b] || -1
        return Number(amountB) - Number(amountA)
      })
      return setSortedMints(sortedMints)
    },
    [mapMintAmounts],
  )
  useEffect(() => {
    sortMints(mints)
  }, [mints, sortMints])

  return { sortedMints, sortMints }
}
