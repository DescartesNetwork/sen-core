import { Address } from '@project-serum/anchor'
import { TokenInfo } from '@solana/spl-token-registry'

import TokenProviderBase from './providers/baseProvider'
import BalansolTokenProvider from './providers/balansolProvider'
import SplTokenProvider from './providers/splProvider'
import SenLpTokenProvider from './providers/senLpProvider'

const DEFAULT_PROVIDER: TokenProviderBase[] = [
  new SplTokenProvider(),
  new BalansolTokenProvider(),
  new SenLpTokenProvider(),
]

class TokenProvider {
  constructor(private providers = DEFAULT_PROVIDER) {}

  all = async (): Promise<TokenInfo[]> => {
    const data = await Promise.all(
      this.providers.map((provider) => provider.all()),
    )
    return data.flat()
  }

  findByAddress = async (addr: Address): Promise<TokenInfo | undefined> => {
    for (const provider of this.providers) {
      const tokenInfo = await provider.findByAddress(addr)
      if (tokenInfo) return tokenInfo
    }
    return undefined
  }

  findAtomicTokens = async (
    addr: Address,
  ): Promise<(TokenInfo | undefined)[]> => {
    for (const provider of this.providers) {
      const tokens = await provider.findAtomicTokens(addr)
      if (tokens) return tokens
    }
    return [undefined]
  }

  find = async (keyword: string, limit = 10): Promise<TokenInfo[]> => {
    const data = await Promise.all(
      this.providers.map((provider) => provider.find(keyword, limit)),
    )
    return data.flat()
  }
}

export default TokenProvider
