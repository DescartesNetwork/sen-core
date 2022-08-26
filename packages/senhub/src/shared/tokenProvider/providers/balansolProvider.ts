import { Program, AnchorProvider, web3, Address } from '@project-serum/anchor'
import { MintData, utils } from '@senswap/sen-js'

import { chainId, Net, net, rpc } from 'shared/runtime'
import { DataLoader } from 'shared/dataloader'
import BaseTokenProvider from './baseProvider'
import { splTokenProvider } from './splProvider'

const LPT_DECIMALS = 9
const PROGRAM_CONFIGS: Record<Net, string> = {
  devnet: 'Hxzy3cvdPz48RodavEN4P41TZp4g6Vd1kEMaUiZMof1u',
  testnet: '',
  mainnet: 'D3BBjqUdCYuP18fNvvMbPAZ8DpcRi4io2EsYHQawJDag',
}

class BalansolTokenProvider extends BaseTokenProvider {
  private provider = new AnchorProvider(new web3.Connection(rpc), {} as any, {})
  private program = new Program(IDL, PROGRAM_CONFIGS[net], this.provider)
  constructor() {
    super()
    this._init()
  }

  private getPools = async () => {
    const key = 'BalansolTokenProvider:getPools'
    return DataLoader.load(key, () => this.program.account.pool.all())
  }

  private getMintLptData = async (mintAddress: Address) => {
    const key = 'BalansolTokenProvider:getMintLptData'
    const connection = this.provider.connection
    const mapMintLpt = await DataLoader.load(key, async () => {
      const result = new Map<string, MintData>()
      const pools = await this.getPools()
      const mintLpts = pools.map((pool) => pool.account.mintLpt)
      const mintLptDatas = await utils.wrappedGetMultipleAccountsInfo(
        connection,
        mintLpts,
      )
      mintLptDatas.forEach((mintLptData, index) => {
        if (!mintLptData?.data) return
        const mintData = window.sentre.splt.parseMintData(
          mintLptData.data as Buffer,
        )
        result.set(mintLpts[index].toBase58(), mintData)
      })
      return result
    })
    return mapMintLpt.get(mintAddress.toString())
  }

  getTokenList = async () => {
    const pools = await this.getPools()
    return Promise.all(
      pools.map(async (pool) => {
        const { mintLpt } = pool.account
        const tokens = await this.findAtomicTokens(mintLpt)
        return {
          address: mintLpt.toBase58(),
          chainId: chainId,
          decimals: LPT_DECIMALS,
          name: 'Balansol LP',
          symbol: tokens?.map((token) => token?.symbol).join(' • ') || '',
        }
      }),
    )
  }

  findAtomicTokens = async (addr: Address) => {
    const pools = await this.getPools()
    for (const pool of pools) {
      const poolData = pool.account
      if (poolData.mintLpt.toBase58() !== addr.toString()) continue
      return Promise.all(
        poolData.mints.map((mint) => splTokenProvider.findByAddress(mint)),
      )
    }
    return undefined
  }

  getPrice = async (mintLp: Address): Promise<number> => {
    return DataLoader.load(`getPrice:${mintLp}`, async () => {
      await this._init()
      const pools = await this.getPools()
      // Find pool with mintLpt
      for (const pool of pools) {
        const { mintLpt, mints, reserves } = pool.account
        if (mintLpt.toString() !== mintLp.toString()) continue
        // Get Mint LPT data
        const mintLptData = await this.getMintLptData(mintLp)
        if (!mintLptData) return 0
        const amount = utils.undecimalize(mintLptData.supply, LPT_DECIMALS)
        if (!Number(amount)) return 0
        // Get pool TVL
        let tvl = 0
        await Promise.all(
          mints.map(async (mint, index) => {
            const amountBN = BigInt(reserves[index].toString())
            const tokenInfo = await splTokenProvider.findByAddress(mint)
            let decimals = tokenInfo?.decimals
            if (!decimals) {
              const mintData = await window.sentre.splt.getMintData(
                mint.toBase58(),
              )
              decimals = mintData.decimals
            }
            const mintAmount = Number(utils.undecimalize(amountBN, decimals))
            if (!mintAmount) return 0

            const mintPrice = await splTokenProvider.getPrice(mint)
            tvl += mintAmount * mintPrice
          }),
        )
        return tvl / Number(amount)
      }
      return 0
    })
  }
}

export default BalansolTokenProvider

export type BalancerAmm = {
  version: '0.1.0'
  name: 'balancer_amm'
  instructions: []
  accounts: [
    {
      name: 'pool'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'fee'
            type: 'u64'
          },
          {
            name: 'taxFee'
            type: 'u64'
          },
          {
            name: 'state'
            type: {
              defined: 'PoolState'
            }
          },
          {
            name: 'mintLpt'
            type: 'publicKey'
          },
          {
            name: 'taxMan'
            type: 'publicKey'
          },
          {
            name: 'mints'
            type: {
              vec: 'publicKey'
            }
          },
          {
            name: 'actions'
            type: {
              vec: {
                defined: 'MintActionState'
              }
            }
          },
          {
            name: 'treasuries'
            type: {
              vec: 'publicKey'
            }
          },
          {
            name: 'reserves'
            type: {
              vec: 'u64'
            }
          },
          {
            name: 'weights'
            type: {
              vec: 'u64'
            }
          },
        ]
      }
    },
  ]
  types: [
    {
      name: 'PoolState'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Uninitialized'
          },
          {
            name: 'Initialized'
          },
          {
            name: 'Frozen'
          },
          {
            name: 'Deleted'
          },
        ]
      }
    },
    {
      name: 'MintActionState'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'Active'
          },
          {
            name: 'BidOnly'
          },
          {
            name: 'AskOnly'
          },
          {
            name: 'Paused'
          },
        ]
      }
    },
  ]
  errors: []
}

export const IDL: BalancerAmm = {
  version: '0.1.0',
  name: 'balancer_amm',
  instructions: [],
  accounts: [
    {
      name: 'pool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'taxFee',
            type: 'u64',
          },
          {
            name: 'state',
            type: {
              defined: 'PoolState',
            },
          },
          {
            name: 'mintLpt',
            type: 'publicKey',
          },
          {
            name: 'taxMan',
            type: 'publicKey',
          },
          {
            name: 'mints',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'actions',
            type: {
              vec: {
                defined: 'MintActionState',
              },
            },
          },
          {
            name: 'treasuries',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'reserves',
            type: {
              vec: 'u64',
            },
          },
          {
            name: 'weights',
            type: {
              vec: 'u64',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'PoolState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitialized',
          },
          {
            name: 'Initialized',
          },
          {
            name: 'Frozen',
          },
          {
            name: 'Deleted',
          },
        ],
      },
    },
    {
      name: 'MintActionState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Active',
          },
          {
            name: 'BidOnly',
          },
          {
            name: 'AskOnly',
          },
          {
            name: 'Paused',
          },
        ],
      },
    },
  ],
  errors: [],
}
