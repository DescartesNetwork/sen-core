import { TokenInfo } from '@solana/spl-token-registry'
import { Program, AnchorProvider, web3, Address } from '@project-serum/anchor'

import { DataLoader } from './../../dataloader/index'
import TokenProviderBase from './baseProvider'
import { chainId, net, rpc } from 'shared/runtime'
import { splTokenProvider } from './splProvider'

const programAddress =
  net === 'mainnet'
    ? 'D3BBjqUdCYuP18fNvvMbPAZ8DpcRi4io2EsYHQawJDag'
    : 'Hxzy3cvdPz48RodavEN4P41TZp4g6Vd1kEMaUiZMof1u'

class BalansolTokenProvider extends TokenProviderBase {
  private provider = new AnchorProvider(new web3.Connection(rpc), {} as any, {})
  private program = new Program(IDL, programAddress, this.provider)
  constructor() {
    super()
    this._init()
  }

  private getPools = async () => {
    const key = 'BalansolTokenProvider:getPools'
    return DataLoader.load(key, () => this.program.account.pool.all())
  }

  getTokenList = async () => {
    const pools = await this.getPools()
    return Promise.all(
      pools.map(async (pool) => {
        const { mintLpt, mints } = pool.account
        const tokens = await Promise.all(
          mints.map((addr) => splTokenProvider.findByAddress(addr)),
        )
        return {
          address: mintLpt.toBase58(),
          chainId: chainId,
          decimals: 9,
          name: tokens.map((token) => token?.name).join(' • '),
          symbol: tokens.map((token) => token?.symbol).join(' • '),
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
