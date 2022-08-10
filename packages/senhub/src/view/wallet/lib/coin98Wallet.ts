import { Transaction, PublicKey } from '@solana/web3.js'
import { sign } from 'tweetnacl'
import { decode } from 'bs58'

import { isAddress } from 'shared/util'
import { collectFee, collectFees } from 'decorators/fee.decorator'
import BaseWallet from './baseWallet'

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
    if (!isAddress(address)) throw new Error('There is no Solana account')
    return address
  }

  @collectFee
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const provider = await this.getProvider()
    const address = await this.getAddress()
    const publicKey = new PublicKey(address)
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
    const publicKey = new PublicKey(address)
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
    const publicKey = new PublicKey(address)
    const bufSig = Buffer.from(signature, 'hex')
    const encodedMsg = new TextEncoder().encode(message)
    const valid = sign.detached.verify(encodedMsg, bufSig, publicKey.toBuffer())
    return valid
  }
}

export default Coin98Wallet
