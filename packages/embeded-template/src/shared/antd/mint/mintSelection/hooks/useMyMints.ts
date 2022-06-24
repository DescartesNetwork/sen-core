import { useCallback, useEffect, useState } from 'react'
import { useAccount } from '@sentre/senhub'

export const useMyMints = () => {
  const [mints, setMints] = useState<string[]>([])
  const { accounts } = useAccount()

  const getMyMints = useCallback(async () => {
    const mints = Object.values(accounts).map((account) => account.mint)
    return setMints(mints)
  }, [accounts])

  useEffect(() => {
    getMyMints()
  }, [getMyMints])

  return mints
}
