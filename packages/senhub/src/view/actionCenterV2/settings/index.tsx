import { Col, Row, Typography } from 'antd'
import Theme from './theme'
import Network from './network'
import Sync from './sync'
import DeveloperMode from './developerMode'
import Notification from './notification'
import Sandbox from './sandbox'

import './index.os.less'

const Settings = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Typography.Title level={5}>Settings</Typography.Title>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Theme />
          </Col>
          <Col span={24}>
            <DeveloperMode />
          </Col>
          <Col span={24}>
            <Notification />
          </Col>
        </Row>
      </Col>
      <Col span={24} /> {/** Safe place */}
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Network />
          </Col>
          <Col span={24}>
            <Sync />
          </Col>
          <Col span={24}>
            <Sandbox />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Settings
