import { AnchorProvider, utils, web3 } from '@project-serum/anchor'
import { Wallet } from '@project-serum/anchor/dist/cjs/provider'
import { SPLT } from '@senswap/sen-js'

import { rpc } from 'shared/runtime'

/**
 * Cluster connection
 */
export const connection = new web3.Connection(rpc, { commitment: 'confirmed' })

/**
 * SPL Token Library - SenswapJS Legacy
 */
export const splt = new SPLT(
  utils.token.TOKEN_PROGRAM_ID.toBase58(),
  utils.token.ASSOCIATED_PROGRAM_ID.toBase58(),
  rpc,
)

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
