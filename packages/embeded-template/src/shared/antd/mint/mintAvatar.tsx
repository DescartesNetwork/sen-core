import { ReactNode, useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import { useMint, usePool } from '@sentre/senhub'

import { Avatar } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const DEFAULT_AVATARS: Array<string | undefined> = [undefined]

export type MintAvatarProps = {
  mintAddress: string
  size?: number
  icon?: ReactNode
  reversed?: boolean
}

/**
 * Mint/Token avatar, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param size - Avatar size. Default 24px.
 * @param icon - Fallback icon for unknown token
 * @param reversed - (Optional) The default LP token avatar is A-B. The reversed is to change it to B-A
 * @returns name
 */
const MintAvatar = ({
  mintAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
  reversed = false,
  ...props
}: MintAvatarProps) => {
  const [avatars, setAvatars] = useState(DEFAULT_AVATARS)
  const { tokenProvider } = useMint()
  const { pools } = usePool()

  const deriveAvatar = useCallback(
    async (address: string) => {
      const token = await tokenProvider.findByAddress(address)
      if (token?.logoURI) return token.logoURI
      return undefined
    },
    [tokenProvider],
  )

  const deriveAvatars = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setAvatars(DEFAULT_AVATARS)
    // LP mint
    const poolData = Object.values(pools || {}).find(
      ({ mint_lpt }) => mint_lpt === mintAddress,
    )
    if (poolData) {
      const { mint_a, mint_b } = poolData
      const avatars = await Promise.all([mint_a, mint_b].map(deriveAvatar))
      if (reversed) avatars.reverse()
      return setAvatars(avatars)
    }
    // Normal mint
    const avatar = await deriveAvatar(mintAddress)
    return setAvatars([avatar])
  }, [mintAddress, reversed, deriveAvatar, pools])

  useEffect(() => {
    deriveAvatars()
  }, [deriveAvatars])

  if (avatars.length === 1)
    return (
      <Avatar
        src={avatars[0]}
        size={size}
        style={{ backgroundColor: '#2D3355', border: 'none' }}
        {...props}
      >
        {icon}
      </Avatar>
    )
  return (
    <Avatar.Group style={{ display: 'block', whiteSpace: 'nowrap' }} {...props}>
      {avatars.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
          {icon}
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default MintAvatar
