import { Transaction } from '@solana/web3.js'
import * as nacl from 'tweetnacl'
import { account } from '@senswap/sen-js'
import { decode, encode } from 'bs58'

import BaseWallet from './baseWallet'
import { collectFee, collectFees } from './decorators'

class SlopeWallet extends BaseWallet {
  private provider: any
  constructor() {
    super('Slope')
    this.provider = null
  }

  async getProvider() {
    const { Slope } = window || {}
    if (!Slope) throw new Error('Cannot connect to Slope')
    if (this.provider) return this.provider
    this.provider = new Slope()
    await this.provider.connect()
    return this.provider
  }

  async getAddress(): Promise<string> {
    const provider = await this.getProvider()
    const { data } = await provider.connect()
    if (!data.publicKey) throw new Error('Wallet is not connected')
    return data.publicKey
  }

  @collectFee
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = account.fromAddress(address)
    if (!transaction.feePayer) transaction.feePayer = publicKey
    const message = encode(transaction.serializeMessage())
    const { msg, data } = await provider.signTransaction(message)
    if (!data.publicKey || !data.signature) throw new Error(msg)
    const signature = decode(data.signature)
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
    const messages = transactions.map((transaction) =>
      encode(transaction.serializeMessage()),
    )
    const { msg, data } = await provider.signAllTransactions(messages)
    if (!data.publicKey || data.signatures?.length !== transactions.length)
      throw new Error(msg)
    data.signatures.forEach((sig: string, i: number) => {
      const signature = decode(sig)
      transactions[i].addSignature(publicKey, signature)
    })
    return transactions
  }

  async verifySignature(signature: string, message: string, address?: string) {
    const slopeAddress = address || (await this.getAddress())
    const publicKey = account.fromAddress(slopeAddress)
    const bufSig = Buffer.from(signature, 'hex')
    const encodedMsg = new TextEncoder().encode(message)
    const valid = nacl.sign.detached.verify(
      encodedMsg,
      bufSig,
      publicKey.toBuffer(),
    )
    return valid
  }
}

export default SlopeWallet
