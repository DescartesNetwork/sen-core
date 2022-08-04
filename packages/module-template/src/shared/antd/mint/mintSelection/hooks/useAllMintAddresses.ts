import { useCallback, useEffect, useState } from 'react'
import { tokenProvider } from '@sentre/senhub'

export const useAllMints = () => {
  const [mints, setMints] = useState<string[]>([])

  const getAllMintAddress = useCallback(async () => {
    const tokens = await tokenProvider.all()
    return setMints(tokens.map((token) => token.address))
  }, [])

  useEffect(() => {
    getAllMintAddress()
  }, [getAllMintAddress])

  return mints
}
