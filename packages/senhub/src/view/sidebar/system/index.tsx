import { Col, Divider, Row } from 'antd'
import SenMarket from './market'
import Nofitications from './nofitications'
import AppSettings from './appSettings'
import Wallet from 'view/wallet'

import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { RootState, useRootSelector } from 'store'

const System = () => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const walletAddress = useWalletAddress()

  const rowAlign = visible ? 'stretch' : 'middle'

  return (
    <Row gutter={[12, 12]} style={{ flexFlow: 'column' }} align={rowAlign}>
      {isAddress(walletAddress) && (
        <Col>
          <AppSettings visible={visible} />
        </Col>
      )}
      <Col>
        <Nofitications visible={visible} />
      </Col>
      <Col>
        <Divider style={{ margin: 0 }} type="horizontal" />
      </Col>
      <Col>
        <SenMarket />
      </Col>
      <Col>
        <Wallet visible={visible} />
      </Col>
    </Row>
  )
}

export default System
