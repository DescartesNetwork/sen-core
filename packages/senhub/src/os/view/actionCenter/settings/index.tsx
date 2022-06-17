import { Row, Col } from 'antd'
import Theme from './theme'
import Network from './network'
import Sync from './sync'
import Sandbox from './sandbox'

const Settings = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Theme />
      </Col>
      <Col span={12}>
        <Sync />
      </Col>
      <Col span={24}>
        <Network />
      </Col>
      <Col span={12}>
        <Sandbox />
      </Col>
    </Row>
  )
}

export default Settings
