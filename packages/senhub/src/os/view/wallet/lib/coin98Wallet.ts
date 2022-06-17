import { Transaction } from '@solana/web3.js'
import { account, SignedMessage } from '@senswap/sen-js'
import { decode } from 'bs58'

import BaseWallet from './baseWallet'
import { collectFee, collectFees } from './decorators'

class Coin98Wallet extends BaseWallet {
  constructor() {
    super('Coin98')
  }

  async getProvider() {
    const { sol } = window?.coin98 || {}
    if (!sol) throw new Error('Wallet is not connected')
    return sol
  }

  async getAddress(): Promise<string> {
    const provider = await this.getProvider()
    const [address] = (await provider.request({ method: 'sol_accounts' })) || []
    if (!account.isAddress(address))
      throw new Error('There is no Solana account')
    return address
  }

  @collectFee
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = account.fromAddress(address)
    if (!transaction.feePayer) transaction.feePayer = publicKey
    const { signature: sig } = await provider.request({
      method: 'sol_sign',
      params: [transaction],
    })
    const signature = decode(sig)
    transaction.addSignature(publicKey, signature)
    return transaction
  }

  @collectFees
  async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = account.fromAddress(address)
    transactions.forEach((transaction) => {
      if (!transaction.feePayer) transaction.feePayer = publicKey
    })
    const { signatures } = await provider.request({
      method: 'sol_signAllTransactions',
      params: [transactions],
    })
    signatures.forEach((sig: string, i: number) => {
      const signature = decode(sig)
      transactions[i].addSignature(publicKey, signature)
    })
    return transactions
  }

  async signMessage(message: string) {
    if (!message) throw new Error('Message must be a non-empty string')
    const provider = await this.getProvider()
    const data = await provider.request({
      method: 'sol_sign',
      params: [message],
    })
    return data as SignedMessage
  }

  async verifySignature(signature: string, message: string, address?: string) {
    address = address || (await this.getAddress())
    const valid = await account.verifySignature(address, signature, message)
    return valid as boolean
  }
}

export default Coin98Wallet
