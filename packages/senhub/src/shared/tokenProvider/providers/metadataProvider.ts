import { chainId } from 'shared/runtime'
import { TokenInfo } from '@solana/spl-token-registry'
import { Address } from '@project-serum/anchor'
import { programs } from '@metaplex/js'

import BaseTokenProvider from './baseProvider'

class MetadataProvider extends BaseTokenProvider {
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
      const { data } = await programs.metadata.Metadata.findByMint(
        window.sentre.splt.connection,
        addr,
      )
      const mintData = await window.sentre.splt.getMintData(addr.toString())
      const uriData = await (await fetch(data.data.uri)).json()
      // Build Token info
      const tokenInfo: TokenInfo = {
        address: addr.toString(),
        chainId: chainId,
        decimals: mintData.decimals,
        name: data.data.name,
        symbol: data.data.symbol,
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
}

export default MetadataProvider
