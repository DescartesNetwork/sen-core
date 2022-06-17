/// <reference types="react-scripts" />

/**
 * Declare global
 */
type SentreNotification = {
  type: 'error' | 'warning' | 'success' | 'info'
  description: string
  onClick?: () => void
}
interface Window {
  // Sentre
  sentre: {
    wallet: import('@senswap/sen-js').WalletInterface
    lamports: import('@senswap/sen-js').Lamports
    splt: import('@senswap/sen-js').SPLT
    swap: import('@senswap/sen-js').Swap
  }
  // IPFS
  ipfs?: ReturnType<import('ipfs-core').create>
  // Utility
  notify: ({ type, description, onClick }: SentreNotification) => void
  // Partner wallets
  coin98: any
  solana: any
  Slope: any
  solflare: any
  clover_solana: any
}

// For bigint serialization
interface BigInt {
  toJSON: (this: bigint) => string
}

// Application ID management
type AppIds = Array<string>
// Application manifest
type ComponentManifest = {
  url: string
  appId: string
  name: string
  author: {
    name: string
    email: string
  }
  tags: string[]
  description: string
  verified: boolean
}
// List of application manifests
type SenReg = Record<string, ComponentManifest | undefined>
// Coingeckko Data
type CgkData = {
  icon: any
  symbol: any
  name: any
  address: any
  rank: any
  price: any
  priceChange: any
  totalVolume: any
}

/**
 * Declare module
 */
declare module '*.md'
