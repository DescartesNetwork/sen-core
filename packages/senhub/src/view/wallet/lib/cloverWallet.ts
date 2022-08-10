import { Transaction, PublicKey } from '@solana/web3.js'
import { sign } from 'tweetnacl'

import { isAddress } from 'shared/util'
import { collectFee, collectFees } from 'decorators/fee.decorator'
import BaseWallet from './baseWallet'

class CloverWallet extends BaseWallet {
  constructor() {
    super('Clover')
  }

  async getProvider() {
    const { clover_solana } = window
    if (!clover_solana?.isCloverWallet)
      throw new Error('Wallet is not connected')
    return clover_solana
  }

  async getAddress(): Promise<string> {
    const provider = await this.getProvider()
    const address = await provider.getAccount()
    if (!isAddress(address)) throw new Error('There is no Solana account')
    return address
  }

  @collectFee
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = new PublicKey(address)
    if (!transaction.feePayer) transaction.feePayer = publicKey
    return await provider.signTransaction(transaction)
  }

  @collectFees
  async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = new PublicKey(address)
    transactions.forEach((transaction) => {
      if (!transaction.feePayer) transaction.feePayer = publicKey
    })
    return await provider.signAllTransactions(transactions)
  }

  async signMessage(message: string) {
    if (!message) throw new Error('Message must be a non-empty string')
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const encodedMsg = new TextEncoder().encode(message)
    const { signature: sig } = await provider.signMessage(encodedMsg, 'utf8')
    const signature = Buffer.from(sig).toString('hex')
    const data = { address, signature, message }
    return data as SignedMessage
  }

  async verifySignature(signature: string, message: string, address?: string) {
    address = address || (await this.getAddress())
    const publicKey = new PublicKey(address)
    const bufSig = Buffer.from(signature, 'hex')
    const encodedMsg = new TextEncoder().encode(message)
    const valid = sign.detached.verify(encodedMsg, bufSig, publicKey.toBuffer())
    return valid
  }
}

export default CloverWallet
