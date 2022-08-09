import { Address } from '@project-serum/anchor'
import { TokenInfo } from '@solana/spl-token-registry'

import BaseTokenProvider from './providers/baseProvider'
import SplTokenProvider from './providers/splProvider'

const DEFAULT_PROVIDER: BaseTokenProvider[] = [new SplTokenProvider()]

class TokenProvider {
  constructor(private readonly providers = DEFAULT_PROVIDER) {}

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
    return [await this.findByAddress(addr)]
  }

  find = async (keyword: string, limit = 10): Promise<TokenInfo[]> => {
    const data = await Promise.all(
      this.providers.map((provider) => provider.find(keyword, limit)),
    )
    return data.flat()
  }
}

export default TokenProvider
