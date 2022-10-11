import { AnchorProvider, web3 } from '@project-serum/anchor'
import { Wallet } from '@project-serum/anchor/dist/cjs/provider'

import { rpc } from 'shared/runtime'

/**
 * Cluster connection
 */
export const connection = new web3.Connection(rpc, { commitment: 'confirmed' })

/**
 * Anchor's Wallet
 */
export const getAnchorWallet = (): Wallet | undefined => {
  if (!window.sentre?.solana?.publicKey) return undefined
  return {
    publicKey: window.sentre.solana.publicKey,
    signTransaction: async (
      transaction: web3.Transaction,
    ): Promise<web3.Transaction> => {
      return await window.sentre.solana.signTransaction(transaction)
    },
    signAllTransactions: async (
      transactions: web3.Transaction[],
    ): Promise<web3.Transaction[]> => {
      return await window.sentre.solana.signAllTransactions(transactions)
    },
  }
}

/**
 * Anchor's Provider
 */
export const getAnchorProvider = (
  anchorWallet = getAnchorWallet(),
): AnchorProvider | undefined => {
  if (!anchorWallet) return undefined
  return new AnchorProvider(connection, anchorWallet, {
    commitment: 'confirmed',
  })
}
