import React from 'react'

import { Col, Radio, Row } from 'antd'

type CheckedProps = {
  checked: boolean
  onClick: () => void
}

const Checked = ({ checked, onClick }: CheckedProps) => {
  return (
    <Row>
      <Col onClick={onClick}>
        <Radio checked={checked} />
      </Col>
    </Row>
  )
}

export default Checked
