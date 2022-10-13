import { Col, Row } from 'antd'
import IconLoading from 'components/loadingSvg'

const PageLoading = () => {
  return (
    <Row
      gutter={[24, 24]}
      style={{ height: '100vh' }}
      justify="center"
      align="middle"
    >
      <Col>
        <IconLoading />
      </Col>
    </Row>
  )
}

export default PageLoading
