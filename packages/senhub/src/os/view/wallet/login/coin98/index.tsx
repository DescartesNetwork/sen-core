import { Row, Card, Col, Avatar, Typography } from 'antd'

import COIN98 from 'os/static/images/wallet/coin98.png'
import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { Coin98Wallet } from '../../lib'

const Coin98 = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    const { coin98 } = window
    if (!coin98)
      return window.notify({
        type: 'warning',
        description:
          'Coin98 Wallet is not installed. If this is the first time you install Coin98 wallet, please restart your browser to complete the setup.',
      })
    const wallet = new Coin98Wallet()
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
          <Avatar size={32} shape="square" src={COIN98} />
        </Col>
        <Col>
          <Typography.Text>Coin98</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default Coin98
