import { Row, Col } from 'antd'
import WalletIntro from './walletIntro'
import AllApplications from './allApplications'

const Applications = () => {
  return (
    <Row gutter={[24, 32]}>
      <Col span={24}>
        <WalletIntro />
      </Col>
      <Col span={24}>
        <AllApplications />
      </Col>
    </Row>
  )
}

export default Applications
