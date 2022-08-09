import lunr, { Index } from 'lunr'
import { TokenInfo } from '@solana/spl-token-registry'
import { Address } from '@project-serum/anchor'

import { net, chainId, ChainId, Net } from 'shared/runtime'
import { SOL_ADDRESS } from '../supplementary'

class BaseTokenProvider {
  protected tokenMap: Map<string, TokenInfo>
  protected engine: Index | undefined
  readonly chainId: ChainId
  readonly cluster: Net
  protected loading: boolean
  protected queue: Array<any>

  constructor() {
    this.tokenMap = new Map<string, TokenInfo>()
    this.engine = undefined
    this.chainId = chainId
    this.cluster = net
    this.loading = false
    this.queue = []
  }

  protected getTokenList = async (): Promise<TokenInfo[]> => {
    throw new Error('GetTokenList function is not declared yet!')
  }

  findAtomicTokens = async (
    addr: Address,
  ): Promise<(TokenInfo | undefined)[] | undefined> => {
    throw new Error('FindAtomicTokens function is not declared yet!')
  }

  protected _init = async (): Promise<[Map<string, TokenInfo>, Index]> => {
    if (this.tokenMap.size && this.engine) return [this.tokenMap, this.engine]
    return new Promise(async (resolve) => {
      // Queue of getters to avoid race condition of multiple _init calling
      if (this.loading) return this.queue.push(resolve)
      // Start
      this.loading = true
      // Build token list
      const tokenList = await this.getTokenList()

      // Build token map
      tokenList.forEach((token) => this.tokenMap.set(token.address, token))
      // Build search engine
      this.engine = lunr(function () {
        this.ref('address')
        this.field('address')
        this.field('symbol')
        this.field('name')
        tokenList.forEach((doc) => this.add(doc))
      })
      // Resolve the main getter
      resolve([this.tokenMap, this.engine])
      // Resolve the rest of getters
      while (this.queue.length) this.queue.shift()([this.tokenMap, this.engine])
      // Finish
      this.loading = false
    })
  }

  all = async (): Promise<TokenInfo[]> => {
    const [tokenMap] = await this._init()
    const filteredToken: TokenInfo[] = []
    tokenMap.forEach((token) => {
      // Ignore SOL Native
      if (token.address !== SOL_ADDRESS) filteredToken.push(token)
    })
    return filteredToken
  }

  findByAddress = async (addr: Address): Promise<TokenInfo | undefined> => {
    const [tokenMap] = await this._init()
    return tokenMap.get(addr.toString())
  }

  find = async (keyword: string, limit = 10): Promise<TokenInfo[]> => {
    const [tokenMap, engine] = await this._init()
    const tokens: TokenInfo[] = []
    if (!keyword) return []
    const fuzzy = `${keyword}^10 ${keyword}~1`
    engine.search(fuzzy).forEach(({ ref }) => {
      if (tokens.findIndex(({ address }) => address === ref) < 0) {
        const token = tokenMap.get(ref)
        // Ignore SOL Native
        if (token && token.address !== SOL_ADDRESS) tokens.push(token)
      }
    })
    if (limit === 0) return tokens
    return tokens.slice(0, limit)
  }
}

export default BaseTokenProvider
