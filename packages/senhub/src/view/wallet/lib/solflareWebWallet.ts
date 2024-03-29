import { Transaction, PublicKey } from '@solana/web3.js'
import { sign } from 'tweetnacl'
import WalletAdapter from '@project-serum/sol-wallet-adapter'

import configs from 'configs'
import { collectFee, collectFees } from 'decorators/fee.decorator'
import BaseWallet from './baseWallet'

const {
  sol: { node },
} = configs
const PROVIDER_URL = 'https://solflare.com/provider'
const PROVIDER: WalletAdapter & WalletProvider = new WalletAdapter(
  PROVIDER_URL,
  node,
)

class SolflareWebWallet extends BaseWallet {
  constructor() {
    super('SolflareWeb')
  }

  async getProvider() {
    if (!PROVIDER.connected) await PROVIDER.connect()
    return PROVIDER
  }

  async getAddress() {
    const provider = await this.getProvider()
    if (!provider.publicKey) throw new Error('Cannot connect to Solflare')
    return provider.publicKey.toBase58()
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
    const { signature: sig } = await provider.sign(encodedMsg, 'utf8')
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

export default SolflareWebWallet
