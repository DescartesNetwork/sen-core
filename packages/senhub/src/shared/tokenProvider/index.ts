import lunr, { Index } from 'lunr'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'

import { net, chainId, ChainId, Net } from 'shared/runtime'
import supplementary, { sntr, sol, SOL_ADDRESS } from './supplementary'

class TokenProvider {
  private tokenMap: Map<string, TokenInfo>
  private engine: Index | undefined
  readonly chainId: ChainId
  readonly cluster: Net
  private loading: boolean
  private queue: Array<any>

  constructor() {
    this.tokenMap = new Map<string, TokenInfo>()
    this.engine = undefined
    this.chainId = chainId
    this.cluster = net
    this.loading = false
    this.queue = []
    // Init
    this._init()
  }

  private _init = async (): Promise<[Map<string, TokenInfo>, Index]> => {
    if (this.tokenMap.size && this.engine) return [this.tokenMap, this.engine]
    return new Promise(async (resolve) => {
      // Queue of getters to avoid race condition of multiple _init calling
      if (this.loading) return this.queue.push(resolve)
      // Start
      this.loading = true
      // Build token list
      let tokenList = await (await new TokenListProvider().resolve())
        .filterByChainId(this.chainId)
        .getList()
      if (this.cluster === 'devnet') tokenList = tokenList.concat(supplementary)
      if (this.cluster === 'testnet')
        tokenList = tokenList.concat([sntr(102), sol(102)])
      else tokenList = tokenList.concat([sol(101)])
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

  findByAddress = async (addr: string): Promise<TokenInfo | undefined> => {
    const [tokenMap] = await this._init()
    return tokenMap.get(addr)
  }

  find = async (keyword: string, limit = 10): Promise<TokenInfo[]> => {
    const [tokenMap, engine] = await this._init()
    let tokens: TokenInfo[] = []
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

export default TokenProvider
