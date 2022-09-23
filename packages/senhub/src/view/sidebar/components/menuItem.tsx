import IonIcon from '@sentre/antd-ionicon'
import { Space, Typography } from 'antd'
import { CSSProperties, ReactNode } from 'react'

type MenuItemProps = {
  icon?: ReactNode
  children?: ReactNode
  style?: CSSProperties
  value?: string
  onClick?: (val: string) => void
  name?: boolean
}
const MenuItem = ({
  icon = <IonIcon name="grid-outline" />,
  children = '',
  style,
  value = '',
  onClick = () => {},
  name = true,
}: MenuItemProps) => {
  return (
    <Space
      size={12}
      style={{ width: '100%', paddingLeft: 8, paddingRight: 8, ...style }}
      onClick={() => onClick(value)}
    >
      {icon}
      {name && (
        <Typography.Text style={{ fontWeight: 600 }}>
          {children || value}
        </Typography.Text>
      )}
    </Space>
  )
}

export default MenuItem
