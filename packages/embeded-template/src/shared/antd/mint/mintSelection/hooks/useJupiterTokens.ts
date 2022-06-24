import { net, Net } from '@sentre/senhub'
import useSWRImmutable from 'swr/immutable'

export const JUP_TOKEN_LIST_URL: Record<Net, string> = {
  devnet: 'https://api.jup.ag/api/tokens/devnet',
  testnet: 'https://api.jup.ag/api/markets/devnet',
  mainnet: 'https://cache.jup.ag/tokens',
}

const loadJptTokens = async () => {
  const tokens = await fetch(JUP_TOKEN_LIST_URL[net]).then((data) =>
    data.json(),
  )
  const tokenMap = new Map<string, boolean>()
  for (const token of tokens) {
    tokenMap.set(token.address, true)
  }
  return {
    verify: (mint: string) => tokenMap.has(mint),
  }
}

export const useJupiterTokens = () => {
  const { data } = useSWRImmutable('fetchJptTokens', loadJptTokens)
  return data
}
