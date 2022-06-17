import { Row, Card, Col, Avatar, Typography } from 'antd'

import PHANTOM from 'os/static/images/wallet/phantom.png'
import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { PhantomWallet } from '../../lib'

const Phantom = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    const { solana } = window
    if (!solana?.isPhantom)
      return window.notify({
        type: 'warning',
        description:
          'Phantom Wallet is not installed. If this is the first time you install Phantom wallet, please restart your browser to complete the setup.',
      })
    const wallet = new PhantomWallet()
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
      bordered={false}
      className="card-wallet-method"
      hoverable
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <Avatar size={32} shape="square" src={PHANTOM} />
        </Col>
        <Col>
          <Typography.Text>Phantom</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default Phantom
