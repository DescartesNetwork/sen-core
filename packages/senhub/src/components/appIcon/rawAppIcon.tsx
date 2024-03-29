import { MouseEvent, ReactNode } from 'react'

import { Space, Avatar, Typography, Badge, AvatarProps } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useAppName } from 'hooks/useAppName'
import configs from 'configs'
import './index.os.less'

const {
  register: { devAppId },
} = configs

export type AppAvatarProps = {
  appId: string
  avatarProps: AvatarProps
}

export const AppAvatar = ({ appId, avatarProps }: AppAvatarProps) => {
  return appId === devAppId ? (
    <Badge.Ribbon className="sentre-ribbon-dev" text="dev" placement="start">
      <Avatar {...avatarProps}>
        <IonIcon name="image-outline" />
      </Avatar>
    </Badge.Ribbon>
  ) : (
    <Avatar {...avatarProps}>
      <IonIcon name="image-outline" />
    </Avatar>
  )
}

export type RawAppIconProps = {
  appId: string
  size?: number
  onClick?: (e: MouseEvent<HTMLElement>) => void
  name?: boolean
  direction?: 'vertical' | 'horizontal'
  children?: ReactNode
  src: ReactNode
}

export const RawVerticalAppIcon = ({
  src,
  appId,
  onClick = () => {},
  size = 64,
  name = true,
}: RawAppIconProps) => {
  const getAppName = useAppName()

  return (
    <Space
      direction="vertical"
      style={{ width: size, textAlign: 'center', lineHeight: 1.25 }}
      onClick={onClick}
    >
      <AppAvatar
        appId={appId}
        avatarProps={{
          src,
          shape: 'square',
          size,
          style: { cursor: 'pointer' },
        }}
      />
      {name ? (
        <Typography.Text
          style={{
            fontSize: Math.floor(size / 4.5),
          }}
        >
          {getAppName(appId)}
        </Typography.Text>
      ) : null}
    </Space>
  )
}

export const RawHorizontalAppIcon = ({
  src,
  appId,
  onClick = () => {},
  size = 32,
  name = true,
}: RawAppIconProps) => {
  const getAppName = useAppName()

  return (
    <Space
      style={{
        cursor: 'pointer',
        lineHeight: 1,
      }}
      onClick={onClick}
    >
      <AppAvatar
        appId={appId}
        avatarProps={{
          src,
          shape: 'square',
          size,
          style: { cursor: 'pointer' },
        }}
      />
      {name ? <Typography.Text>{getAppName(appId)}</Typography.Text> : null}
    </Space>
  )
}

const RawAppIcon = ({ direction = 'vertical', ...rest }: RawAppIconProps) => {
  if (direction === 'vertical') return <RawVerticalAppIcon {...rest} />
  return <RawHorizontalAppIcon {...rest} />
}

export default RawAppIcon
