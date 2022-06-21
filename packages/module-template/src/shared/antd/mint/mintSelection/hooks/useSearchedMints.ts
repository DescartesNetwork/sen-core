import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@sentre/senhub'

import { useAllMintAddresses } from './useAllMintAddresses'

let searching: NodeJS.Timeout

export const useSearchedMints = (keyword: string = '', limit: number) => {
  const [loading, setLoading] = useState(false)
  const [searchedMints, setSearchedMints] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const mints = useAllMintAddresses()

  const search = useCallback(async () => {
    if (!keyword) {
      setLoading(false)
      return setSearchedMints(mints)
    }
    if (searching) clearTimeout(searching)
    setLoading(true)
    searching = setTimeout(async () => {
      const addresses = (await tokenProvider.find(keyword, limit)).map(
        ({ address }) => address,
      )
      setLoading(false)
      return setSearchedMints(addresses)
    }, 500)
  }, [keyword, limit, mints, tokenProvider])

  useEffect(() => {
    search()
  }, [search])

  return { searchedMints, loading }
}
