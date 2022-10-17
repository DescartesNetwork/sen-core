import { TokenInfo } from '@solana/spl-token-registry'
import { Address } from '@project-serum/anchor'
import { programs } from '@metaplex/js'

import { chainId } from 'shared/runtime'
import { isAddress } from 'shared/util'
import BaseTokenProvider from './baseProvider'
import { splt } from 'providers/sol.provider'

class MetaplexProvider extends BaseTokenProvider {
  constructor() {
    super()
    this._init()
  }

  getTokenList = async () => {
    return Array.from(this.tokenMap.values())
  }

  findAtomicTokens = async (addr: Address) => {
    return [await this.findByAddress(addr)]
  }

  findByAddress = async (addr: Address): Promise<TokenInfo | undefined> => {
    try {
      if (this.tokenMap.has(addr.toString())) this.tokenMap.get(addr.toString())
      // Fetch new data
      const {
        data: { data: metadata },
      } = await programs.metadata.Metadata.findByMint(splt.connection, addr)
      const mintData = await splt.getMintData(addr.toString())
      const uriData = await (await fetch(metadata.uri)).json()
      // Build Token info
      const tokenInfo: TokenInfo = {
        address: addr.toString(),
        chainId: chainId,
        decimals: mintData.decimals,
        name: metadata.name,
        symbol: metadata.symbol,
        logoURI: uriData.image,
      }
      // Cache data + build search engine
      this.tokenMap.set(addr.toString(), tokenInfo)
      await this._init()
      return tokenInfo
    } catch (error) {
      return undefined
    }
  }

  find = async (keyword: string, limit = 10): Promise<TokenInfo[]> => {
    const [tokenMap, engine] = await this._init()
    const tokens: TokenInfo[] = []
    if (!keyword) return []
    const fuzzy = `${keyword}^10 ${keyword}~1`
    engine.search(fuzzy).forEach(({ ref }) => {
      if (tokens.findIndex(({ address }) => address === ref) < 0) {
        const token = tokenMap.get(ref)
        if (token) tokens.push(token)
      }
    })
    // Search on blockchain
    if (!tokens.length && isAddress(keyword)) {
      const tokenInfo = await this.findByAddress(keyword)
      if (tokenInfo) return [tokenInfo]
    }
    if (limit === 0) return tokens
    return tokens.slice(0, limit)
  }
}

export default MetaplexProvider
