import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@sentre/senhub'

import { useMyMints } from './useMyMints'
import { useSortMints } from 'shared/hooks/useSortMints'
import { useJupiterTokens } from './useJupiterTokens'

let searching: NodeJS.Timeout

export const useSearchedMints = (keyword: string = '') => {
  const [loading, setLoading] = useState(false)
  const [searchedMints, setSearchedMints] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const jptTokens = useJupiterTokens()
  const myMints = useMyMints()
  const { sortedMints } = useSortMints(myMints)

  const buildDefaultTokens = useCallback(async () => {
    let filteredMints = new Set<string>()
    for (const mint of sortedMints) {
      const valid = await tokenProvider.findByAddress(mint)
      if (valid) filteredMints.add(mint)
    }
    const allMints = await tokenProvider.all()
    for (const mint of allMints) filteredMints.add(mint.address)
    return Array.from(filteredMints)
  }, [sortedMints, tokenProvider])

  const search = useCallback(async () => {
    setLoading(true)
    if (searching) clearTimeout(searching)
    const time = !keyword ? 0 : 500
    searching = setTimeout(async () => {
      try {
        if (!keyword) {
          const defaultMints = await buildDefaultTokens()
          return setSearchedMints(defaultMints)
        }
        const tokens = await tokenProvider.find(keyword, 0)
        const verifiedTokens: string[] = []
        const unverifiedTokens: string[] = []
        for (const mint of tokens) {
          const verified = jptTokens?.verify(mint.address)
          if (verified) verifiedTokens.push(mint.address)
          else unverifiedTokens.push(mint.address)
        }
        let mints = verifiedTokens.concat(unverifiedTokens)
        // In some cases, mint that the user wants to select is not included in the token provider
        // This allows the user to choose any mint that the user wants
        if (!mints.length) mints = myMints.filter((mint) => mint === keyword)
        return setSearchedMints(mints)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }, time)
  }, [buildDefaultTokens, jptTokens, keyword, myMints, tokenProvider])

  useEffect(() => {
    search()
  }, [search])

  return { searchedMints, loading }
}
