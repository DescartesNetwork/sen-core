import storage from './storage'

/**
 * Environment
 */
const getEnv = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'development':
      return 'development'
    case 'production':
      return 'production'
    default:
      return 'development'
  }
}
export type Env = 'development' | 'production'
export const env: Env = getEnv()

/**
 * Network
 */
const getNetwork = () => {
  switch (storage.get('network')) {
    case 'devnet':
      return 'devnet'
    case 'testnet':
      return 'testnet'
    case 'mainnet':
      return 'mainnet'
    default:
      return 'mainnet'
  }
}
export type Net = 'devnet' | 'testnet' | 'mainnet'
export const net: Net = getNetwork()

export const onSwitchNetwork = (value: Net) => {
  storage.set('network', value)
  return window.location.reload()
}

/**
 * Chain ID
 */
const getChainId = () => {
  switch (net) {
    case 'devnet':
      return 103
    case 'testnet':
      return 102
    case 'mainnet':
      return 101
    default:
      return 101
  }
}
export type ChainId = 101 | 102 | 103
export const chainId: ChainId = getChainId()

/**
 * RPC Node
 */
const CLUSTERS: Record<Net, string> = {
  devnet: 'https://devnet.genesysgo.net',
  testnet: 'https://api.testnet.solana.com',
  mainnet:
    'https://solitary-autumn-water.solana-mainnet.quiknode.pro/05b03a0cfeb8a5ec38f4c55950eb9b9bad7c8b58',
}
export const rpc: string = CLUSTERS[net]
