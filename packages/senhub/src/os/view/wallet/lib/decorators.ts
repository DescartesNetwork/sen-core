import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js'

import configs from 'os/configs'

const {
  sol: { taxmanAddress, platformFee },
} = configs

export const collectFee = (
  target: any,
  memberName: string,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value
  descriptor.value = async function (tx: Transaction) {
    const ix = SystemProgram.transfer({
      fromPubkey: tx.feePayer || (await target.getAddress()),
      toPubkey: new PublicKey(taxmanAddress),
      lamports: platformFee,
    })
    tx.add(ix)
    return original.call(target, tx)
  }
}

export const collectFees = (
  target: any,
  memberName: string,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value
  descriptor.value = async (txs: Transaction[]) => {
    for (const tx of txs) {
      const ix = SystemProgram.transfer({
        fromPubkey: tx.feePayer || (await target.getAddress()),
        toPubkey: new PublicKey(taxmanAddress),
        lamports: platformFee,
      })
      tx.add(ix)
    }
    return original.call(target, txs)
  }
}
