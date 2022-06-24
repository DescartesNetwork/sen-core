import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js'

import configs from 'configs'

const {
  sol: { taxmanAddress, platformFee },
} = configs

export const addFeeInstruction = (
  tx: Transaction,
  payer: PublicKey,
): Transaction => {
  for (const { signature } of tx.signatures) {
    if (signature) return tx
  }
  const ix = SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: new PublicKey(taxmanAddress),
    lamports: platformFee,
  })
  tx.add(ix)
  return tx
}

export const collectFee = (
  target: any,
  memberName: string,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value
  descriptor.value = async function (tx: Transaction) {
    const payer = tx.feePayer || (await target.getAddress())
    const chagredTx = addFeeInstruction(tx, payer)
    return original.call(target, chagredTx)
  }
}

export const collectFees = (
  target: any,
  memberName: string,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value
  descriptor.value = async (txs: Transaction[]) => {
    let chargedTxs = []
    for (const tx of txs) {
      const payer = tx.feePayer || (await target.getAddress())
      const chagredTx = addFeeInstruction(tx, payer)
      chargedTxs.push(chagredTx)
    }
    return original.call(target, chargedTxs)
  }
}
