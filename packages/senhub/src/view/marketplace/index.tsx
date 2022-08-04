import { Row, Col } from 'antd'
import PageLoader from 'components/pageLoader'

export const REGISTER_APP_STORE: Record<string, ComponentManifest> = {
  store: {
    url: 'https://descartesnetwork.github.io/sen-store/index.js',
    appId: 'store',
    name: 'Store',
    author: { name: 'Sentre', email: 'hi@sentre.io' },
    tags: ['system', 'store'],
    description: 'The first DApp Store on Solana',
    verified: false,
  },
}

const Marketplace = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <PageLoader {...REGISTER_APP_STORE.store} />
      </Col>
    </Row>
  )
}

export default Marketplace
