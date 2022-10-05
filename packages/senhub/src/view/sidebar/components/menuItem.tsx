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
      style={{
        width: '100%',
        minWidth: 32,
        minHeight: 32,
        padding: 8,
        ...style,
        cursor: 'pointer',
      }}
      // onClick={() => onClick(value)}
    >
      <Typography.Text type="secondary" style={{ fontSize: 18 }}>
        {icon}
      </Typography.Text>
      {name && (
        <Typography.Text type="secondary" style={{ fontWeight: 600 }}>
          {children || value}
        </Typography.Text>
      )}
    </Space>
  )
}

export default MenuItem
