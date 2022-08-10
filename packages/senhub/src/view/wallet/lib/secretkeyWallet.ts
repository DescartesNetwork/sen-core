import { Transaction, Keypair } from '@solana/web3.js'
import { sign, hash } from 'tweetnacl'
import { PublicKey } from '@solana/web3.js'

import session from 'shared/session'
import storage from 'shared/storage'
import { collectFee, collectFees } from 'decorators/fee.decorator'
import BaseWallet from './baseWallet'

type ExpanedProvider = WalletProvider & { keypair: Keypair }

class SecretKeyWallet extends BaseWallet {
  constructor(secretKey: string, password?: string) {
    super('SecretKey')

    SecretKeyWallet.setSecretKey(secretKey, password)
  }

  static xor(
    a: Buffer | Uint8Array,
    b: Buffer | Uint8Array,
  ): Buffer | Uint8Array {
    if (a.length !== b.length)
      throw new Error('Cannot XOR two different-length buffers')
    const r = Buffer.alloc(a.length)
    for (let i = 0; i < r.length; i++) r[i] = a[i] ^ b[i]
    return r
  }

  static getPassword(): string {
    let pwd = session.get('Password')
    if (!pwd) pwd = window.prompt('Input the password:')
    if (!pwd) throw new Error('User rejects to sign the transaction')
    session.set('Password', pwd)
    return pwd
  }

  static setSecretKey(secretKey: string, pwd?: string): void {
    const keypair = Keypair.fromSecretKey(Buffer.from(secretKey, 'hex'))
    pwd = pwd || SecretKeyWallet.getPassword()
    const seed = hash(Buffer.from(pwd))
    const confusedSecretKey = SecretKeyWallet.xor(seed, keypair.secretKey)
    storage.set('SecretKey', confusedSecretKey.toString('hex'))
  }

  static getSecretKey(pwd?: string): string {
    pwd = pwd || SecretKeyWallet.getPassword()
    const seed = hash(Buffer.from(pwd))
    const confusedSecretKey = storage.get('SecretKey')
    if (!confusedSecretKey) throw new Error('Invalid secret key')
    const secretKey = SecretKeyWallet.xor(
      seed,
      Buffer.from(confusedSecretKey, 'hex'),
    )
    return secretKey.toString('hex')
  }

  async getProvider(): Promise<ExpanedProvider> {
    const secretKey = SecretKeyWallet.getSecretKey()
    const keypair = Keypair.fromSecretKey(Buffer.from(secretKey, 'hex'))
    if (!keypair) throw new Error('Cannot get the keystore-based provider')
    const provider = {
      keypair,
      disconnect: () => {
        session.clear('Password')
        storage.clear('SecretKey')
      },
    }
    return provider
  }

  async getAddress(): Promise<string> {
    const { keypair } = await this.getProvider()
    return keypair.publicKey.toBase58()
  }

  @collectFee
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    const confirmed = window.confirm('Please confirm to sign the transaction!')
    if (!confirmed) throw new Error('User rejects to sign the transaction')
    const { keypair } = await this.getProvider()
    const signData = transaction.serializeMessage()
    const publicKey = keypair.publicKey
    if (!transaction.feePayer) transaction.feePayer = publicKey
    const signature = sign.detached(signData, keypair.secretKey)
    transaction.addSignature(publicKey, Buffer.from(signature))
    return transaction
  }

  @collectFees
  async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const confirmed = window.confirm('Please confirm to sign the transactions!')
    if (!confirmed) throw new Error('User rejects to sign the transactions')
    const { keypair } = await this.getProvider()
    const txs: Transaction[] = []
    for (const transaction of transactions) {
      const signData = transaction.serializeMessage()
      const publicKey = keypair.publicKey
      if (!transaction.feePayer) transaction.feePayer = publicKey
      const signature = sign.detached(signData, keypair.secretKey)
      transaction.addSignature(publicKey, Buffer.from(signature))
      txs.push(transaction)
    }
    return txs
  }

  async signMessage(message: string) {
    if (!message) throw new Error('Message must be a non-empty string')
    const confirmed = window.confirm(
      `Please confirm to sign the message! Message: ${message}`,
    )
    if (!confirmed) throw new Error('User rejects to sign the message')
    const { keypair } = await this.getProvider()
    const address = keypair.publicKey.toBase58()
    const buf = sign.detached(Buffer.from(message, 'hex'), keypair.secretKey)
    const signature = Buffer.from(buf).toString('hex')
    return { address, signature, message }
  }

  async verifySignature(signature: string, message: string, address?: string) {
    address = address || (await this.getAddress())
    const valid = sign.detached.verify(
      Buffer.from(message, 'hex'),
      Buffer.from(signature, 'hex'),
      new PublicKey(address).toBuffer(),
    )
    return valid
  }
}

export default SecretKeyWallet
