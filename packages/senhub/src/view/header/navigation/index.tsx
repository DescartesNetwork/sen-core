import { Row, Col } from 'antd'
import AppList from './appList'

const Navigation = () => {
  return (
    <Row gutter={[12, 12]} wrap={false}>
      <Col
        span={24}
        style={{ width: 0, marginLeft: 8 }}
        className="scrollbar"
        flex="auto"
      >
        <AppList />
      </Col>
    </Row>
  )
}

export default Navigation
