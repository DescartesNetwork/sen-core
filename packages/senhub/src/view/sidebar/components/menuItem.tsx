import { CSSProperties, ReactNode } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Space, Typography } from 'antd'

type MenuItemProps = {
  icon?: ReactNode
  children?: ReactNode
  style?: CSSProperties
  value?: string
  onClick?: (val: string) => void
  name?: boolean
  disabled?: boolean
}
const MenuItem = ({
  icon = <IonIcon name="grid-outline" />,
  children = '',
  style,
  value = '',
  onClick = () => {},
  name = true,
  disabled = false,
}: MenuItemProps) => {
  const textType = disabled ? 'secondary' : undefined

  return (
    <Space
      size={12}
      style={{
        width: '100%',
        minWidth: 32,
        minHeight: 32,
        padding: 8,
        ...style,
        cursor: 'pointer',
      }}
      onClick={() => !disabled && onClick(value)}
    >
      <Typography.Text type={textType} style={{ fontSize: 18 }}>
        {icon}
      </Typography.Text>
      {name && (
        <Typography.Text type={textType} style={{ fontWeight: 600 }}>
          {children || value}
        </Typography.Text>
      )}
    </Space>
  )
}

export default MenuItem
