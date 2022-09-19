/***
 * Copyright of React Scripts
 */

/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PUBLIC_URL: string
  }
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

/**
 * Copyright of Senhub
 */

type SentreNotification = {
  type: 'error' | 'warning' | 'success' | 'info'
  description: string
  onClick?: () => void
}
type SentreMessage = {
  type: 'error' | 'warning' | 'success' | 'info' | 'loading'
  description: string
  onClick?: () => void
}
interface Window {
  // Sentre
  sentre: {
    wallet: WalletInterface
    lamports: import('@senswap/sen-js').Lamports
    splt: import('@senswap/sen-js').SPLT
    swap: import('@senswap/sen-js').Swap
  }
  // IPFS
  ipfs?: any
  // Utility
  notify: ({ type, description, onClick }: SentreNotification) => void
  message: ({ type, description, onClick }: SentreMessage) => void
  // Partner wallets
  coin98: any
  solana: any
  Slope: any
  solflare: any
  clover_solana: any
  exodus: any
  phantom: any
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

// For markdown import
declare module '*.md'

// Wallet

interface WalletProvider {
  disconnect: () => void
}

type SignedMessage = {
  address: string // Base58 string
  signature: string // Hex string
  message: string // Utf8 string
}

interface WalletInterface {
  /**
   * Any string that you can recognize your wallet type. For example: PrivateKey, Phantom, Sollet, ...
   */
  walletType: string

  /**
   * Wallet providers are varied from the original wallet (Coin98, Slope, ...).
   * Seems there is no single common standard, thus we only require `disconnect` method for the returned `provider`.
   * @return Provider
   */
  getProvider(): Promise<WalletProvider>

  /**
   * Return wallet address
   * @returns Wallet address (base58)
   */
  getAddress(): Promise<string>

  /**
   * Sign the input transaction and return signed transaction
   * @param transaction - The transaction that needs to be signed
   * @returns The signed transaction
   */
  signTransaction(
    transaction: import('@solana/web3.js').Transaction,
  ): Promise<import('@solana/web3.js').Transaction>

  /**
   * Sign the input transactions and return signed transactions
   * @param transaction - The transaction that needs to be signed
   * @returns The signed transactions
   */
  signAllTransactions(
    transactions: import('@solana/web3.js').Transaction[],
  ): Promise<import('@solana/web3.js').Transaction[]>

  /**
   * Sign a message and return a signed messaged
   * @param message - String needs to be signed
   * @returns SignedMessage
   */
  signMessage(message: string): Promise<SignedMessage>

  /**
   * Verify a singed message
   * @param signature - Signature (`signedMessage.signature`)
   * @param message - The original message (or `signedMessage.message`)
   * @param address - Optional. The address that signed the message. If not provided, the `address` will be fetched by `this.getAddress()`.
   */
  verifySignature(
    signature: string,
    message: string,
    address?: string,
  ): Promise<boolean>

  /**
   * Call the `disconnect` method from `provider` returned by `getProvider`
   */
  disconnect(): Promise<void>
}
