import { account, Keystore } from '@senswap/sen-js'

import SecretKeyWallet from './secretkeyWallet'

class KeystoreWallet extends SecretKeyWallet {
  constructor(keystore: Keystore, password: string) {
    super(KeystoreWallet.extractSecretKey(keystore, password), password)
  }

  static extractSecretKey = (keystore: Keystore, password: string): string => {
    const keypair = account.fromKeystore(keystore, password)
    if (!keypair) throw new Error('Invalid ketstore or password')
    const secretKey = Buffer.from(keypair.secretKey).toString('hex')
    return secretKey
  }
}

export default KeystoreWallet
