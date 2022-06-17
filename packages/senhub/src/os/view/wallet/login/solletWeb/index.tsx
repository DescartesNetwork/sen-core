import { Row, Card, Col, Avatar, Typography } from 'antd'

import SOLLET from 'os/static/images/wallet/sollet.png'
import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { SolletWallet } from '../../lib'

const SolletWeb = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    const wallet = new SolletWallet()
    try {
      await dispatch(connectWallet(wallet)).unwrap()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }

  return (
    <Card
      onClick={connect}
      style={{ cursor: 'pointer', borderRadius: 8, boxShadow: 'unset' }}
      className="card-wallet-method"
      bordered={false}
      hoverable
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <Avatar size={32} shape="square" src={SOLLET} />
        </Col>
        <Col>
          <Typography.Text>Sollet Web</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default SolletWeb
