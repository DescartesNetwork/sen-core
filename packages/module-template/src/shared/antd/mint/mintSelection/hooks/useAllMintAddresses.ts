import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@sentre/senhub'

export const useAllMints = () => {
  const [mints, setMints] = useState<string[]>([])
  const { tokenProvider } = useMint()

  const getAllMintAddress = useCallback(async () => {
    const tokens = await tokenProvider.all()
    return setMints(tokens.map((token) => token.address))
  }, [tokenProvider])

  useEffect(() => {
    getAllMintAddress()
  }, [getAllMintAddress])

  return mints
}
