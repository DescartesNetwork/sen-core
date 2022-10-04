import { web3 } from '@project-serum/anchor'

/**
 * The Solana Name Service program ID
 */
export const NAME_PROGRAM_ID = new web3.PublicKey(
  'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX',
)

/**
 * Hash prefix used to derive domain name addresses
 */
export const HASH_PREFIX = 'SPL Name Service'

/**
 * The reverse look up class
 */
export const REVERSE_LOOKUP_CLASS = new web3.PublicKey(
  '33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z',
)

/**
 * The `.sol` TLD
 */
export const ROOT_DOMAIN_ACCOUNT =
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
