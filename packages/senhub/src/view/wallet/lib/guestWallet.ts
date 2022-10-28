import { Transaction, PublicKey } from '@solana/web3.js'

import BaseWallet from './baseWallet'

export const GUEST_ADDRESS = 'GuestAccount11111111111111111111111111111111'

type ExpanedProvider = WalletProvider & { address: string }

class GuestWallet extends BaseWallet {
  private _callback = () => {}

  constructor(callback: () => void = () => {}) {
    super('Guest')

    this._callback = callback
    this.publicKey = new PublicKey(GUEST_ADDRESS)
  }

  async getProvider(): Promise<ExpanedProvider> {
    const provider = {
      address: GUEST_ADDRESS,
      disconnect: () => {},
    }
    return provider
  }

  async getAddress(): Promise<string> {
    const { address } = await this.getProvider()
    return address
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    await this._callback()
    return transaction
  }

  async signAllTransaction(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    await this._callback()
    return transactions
  }

  async signMessage(message: string) {
    await this._callback()
    return { signature: '', address: GUEST_ADDRESS, message }
  }

  async verifySignature(signature: string, message: string, address?: string) {
    await this._callback()
    return false
  }

  async disconnect() {}
}

export default GuestWallet
