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
    wallet: import('@senswap/sen-js').WalletInterface
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
