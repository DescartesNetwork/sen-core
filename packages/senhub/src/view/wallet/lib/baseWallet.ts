import { PublicKey, Transaction } from '@solana/web3.js'

import storage from 'shared/storage'

class BaseWallet implements WalletInterface {
  readonly walletType: string
  public publicKey: PublicKey | null

  constructor(walletType: string) {
    this.walletType = walletType
    this.publicKey = null
    storage.set('WalletType', this.walletType)
  }

  async getProvider(): Promise<WalletProvider> {
    throw new Error('Wallet is not connected')
  }

  async getAddress(): Promise<string> {
    throw new Error('Wallet is not connected')
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error('Wallet is not connected')
  }

  async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    throw new Error('Wallet is not connected')
  }

  async signMessage(message: string): Promise<SignedMessage> {
    throw new Error('Wallet is not connected')
  }

  async verifySignature(
    signature: string,
    message: string,
    address?: string,
  ): Promise<boolean> {
    throw new Error('Wallet is not connected')
  }

  async disconnect(): Promise<void> {
    storage.clear('WalletType')
    const provider = await this.getProvider()
    provider.disconnect()
  }
}

export default BaseWallet
