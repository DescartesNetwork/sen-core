import { CSSProperties, ReactNode } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Col, Row, Typography } from 'antd'

type MenuItemProps = {
  icon?: ReactNode
  children?: ReactNode
  style?: CSSProperties
  value?: string
  onClick?: (val: string) => void
  name?: boolean
  disabled?: boolean
  postfix?: ReactNode
}
const MenuItem = ({
  icon = <IonIcon name="grid-outline" />,
  children = '',
  style,
  value = '',
  onClick = () => {},
  name = true,
  disabled = false,
  postfix = '',
}: MenuItemProps) => {
  const textType = disabled ? 'secondary' : undefined

  return (
    <Row
      gutter={12}
      style={{
        minWidth: 32,
        minHeight: 32,
        padding: 8,
        ...style,
        cursor: 'pointer',
      }}
      align="middle"
      onClick={() => !disabled && onClick(value)}
    >
      <Col>
        <Typography.Text type={textType} style={{ fontSize: 18 }}>
          {icon}
        </Typography.Text>
      </Col>

      {name && (
        <Col flex="auto">
          <Row justify="space-between" align="middle">
            <Col>
              <Typography.Text type={textType} style={{ fontWeight: 600 }}>
                {children || value}
              </Typography.Text>
            </Col>
            <Col>{postfix}</Col>
          </Row>
        </Col>
      )}
    </Row>
  )
}

export default MenuItem
