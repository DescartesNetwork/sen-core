import { Transaction, PublicKey } from '@solana/web3.js'
import { sign } from 'tweetnacl'

import { isAddress } from 'shared/util'
import { collectFee, collectFees } from 'decorators/fee.decorator'
import BaseWallet from './baseWallet'

class PhantomWallet extends BaseWallet {
  constructor() {
    super('Phantom')
  }

  async getProvider() {
    const { solana } = window.phantom
    if (!solana?.isPhantom) throw new Error('Wallet is not connected')
    if (solana.isConnected) return solana

    return await new Promise((resolve) => {
      solana.on('connect', () => resolve(solana))
      return solana.connect()
    })
  }

  async getAddress(): Promise<string> {
    const provider = await this.getProvider()
    const address = provider.publicKey.toString()
    if (!isAddress(address)) throw new Error('There is no Solana account')
    return address
  }

  @collectFee
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = new PublicKey(address)
    if (!transaction.feePayer) transaction.feePayer = publicKey
    const signedTx = await provider.signTransaction(transaction)
    return signedTx
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
    const signedTransactions = await provider.signAllTransactions(transactions)
    return signedTransactions
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

export default PhantomWallet
