import { Transaction } from '@solana/web3.js'
import { Provider } from '@senswap/sen-js'

import BaseWallet from './baseWallet'

export const GUEST_ADDRESS = 'GuestAccount11111111111111111111111111111111'

type ExpanedProvider = Provider & { address: string }

class GuestWallet extends BaseWallet {
  constructor(callback: () => void = () => {}) {
    super('Guest')

    this._callback = callback
  }

  private _callback = () => {}
  private _error = () => {
    throw new Error(
      'You are in the Guest Mode. Please connect your personal wallet to proceed the action.',
    )
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
    return this._error()
  }

  async signAllTransaction(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    await this._callback()
    return this._error()
  }

  async signMessage(message: string) {
    await this._callback()
    return this._error()
  }

  async verifySignature(signature: string, message: string, address?: string) {
    await this._callback()
    return this._error()
  }
}

export default GuestWallet
