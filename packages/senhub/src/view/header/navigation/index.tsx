import { account } from '@senswap/sen-js'

import { Row, Col } from 'antd'
import AppList from './appList'

import { useRootSelector, RootState } from 'store'

const Navigation = () => {
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  if (!account.isAddress(walletAddress)) return null
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
