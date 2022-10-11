import { web3 } from '@project-serum/anchor'
import { deserializeUnchecked, Schema } from 'borsh'
import { connection } from 'store/wallet.reducer'

export class NameService {
  static HEADER_LEN = 96
  parentName: web3.PublicKey
  owner: web3.PublicKey
  class: web3.PublicKey
  data: Buffer | undefined

  static schema: Schema = new Map([
    [
      NameService,
      {
        kind: 'struct',
        fields: [
          ['parentName', [32]],
          ['owner', [32]],
          ['class', [32]],
        ],
      },
    ],
  ])

  constructor(obj: {
    parentName: Uint8Array
    owner: Uint8Array
    class: Uint8Array
  }) {
    this.parentName = new web3.PublicKey(obj.parentName)
    this.owner = new web3.PublicKey(obj.owner)
    this.class = new web3.PublicKey(obj.class)
  }

  public static async retrieve(
    nameAccountKey: web3.PublicKey,
  ): Promise<NameService> {
    const nameAccount = await connection.getAccountInfo(
      nameAccountKey,
      'processed',
    )
    if (!nameAccount) {
      throw new Error('Invalid name account provided')
    }

    const res: NameService = deserializeUnchecked(
      this.schema,
      NameService,
      nameAccount.data,
    )

    res.data = nameAccount.data?.slice(this.HEADER_LEN)

    return res
  }
}
