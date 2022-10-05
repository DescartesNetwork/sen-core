import { sha256 } from 'js-sha256'
import { BN, web3 } from '@project-serum/anchor'

import { NameService } from './nameService'
import configs from 'configs'

const {
  sol: { snsProgramId, hashPrefix, reverseLookupClass },
} = configs

export const getHashedName = async (name: string): Promise<Buffer> => {
  const input = hashPrefix + name
  const str = sha256(Buffer.from(input, 'utf8'))
  return Buffer.from(str, 'hex')
}

export const getNameAccountKey = async (
  hashed_name: Buffer,
  nameClass?: web3.PublicKey,
  nameParent?: web3.PublicKey,
): Promise<web3.PublicKey> => {
  const seeds = [hashed_name]
  if (nameClass) {
    seeds.push(nameClass.toBuffer())
  } else {
    seeds.push(Buffer.alloc(32))
  }
  if (nameParent) {
    seeds.push(nameParent.toBuffer())
  } else {
    seeds.push(Buffer.alloc(32))
  }
  const [nameAccountKey] = await web3.PublicKey.findProgramAddress(
    seeds,
    new web3.PublicKey(snsProgramId),
  )
  return nameAccountKey
}

export const performReverseLookup = async (
  nameAccount: web3.PublicKey,
): Promise<string> => {
  const hashedReverseLookup = await getHashedName(nameAccount.toBase58())
  const reverseLookupAccount = await getNameAccountKey(
    hashedReverseLookup,
    new web3.PublicKey(reverseLookupClass),
  )

  const registry = await NameService.retrieve(reverseLookupAccount)
  if (!registry.data) throw new Error('Could not retrieve name data')
  const nameLength = new BN(registry.data.slice(0, 4), 'le').toNumber()
  return registry.data.slice(4, 4 + nameLength).toString()
}
