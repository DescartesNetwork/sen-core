import { Row, Card, Col, Avatar, Typography } from 'antd'

import SOLFLARE from 'os/static/images/wallet/solflare.png'
import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { SolflareWebWallet } from '../../lib'

const Solflare = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    const solflareWebWallet = new SolflareWebWallet()
    try {
      await dispatch(connectWallet(solflareWebWallet)).unwrap()
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    }
  }

  return (
    <Card
      onClick={connect}
      style={{ cursor: 'pointer', borderRadius: 8, boxShadow: 'unset' }}
      bordered={false}
      className="card-wallet-method"
      hoverable
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <Avatar size={32} shape="square" src={SOLFLARE} />
        </Col>
        <Col>
          <Typography.Text>Solflare Web</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default Solflare
