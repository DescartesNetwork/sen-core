import { CSSProperties, ReactNode } from 'react'

import { Col, Row } from 'antd'

import { useAppWidth } from 'hooks/useUI'

export type LayoutBodyProps = {
  children?: ReactNode
  style?: CSSProperties
}

const LayoutBody = ({ children, style }: LayoutBodyProps) => {
  const width = useAppWidth()

  return (
    <div className="sentre-body" style={{ ...style, padding: 12, width }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>{children}</Col>
      </Row>
    </div>
  )
}

export default LayoutBody
