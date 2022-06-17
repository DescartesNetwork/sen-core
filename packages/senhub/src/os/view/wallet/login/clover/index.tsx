import { Row, Card, Col, Avatar, Typography } from 'antd'

import CLOVER from 'os/static/images/wallet/clover.png'
import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { CloverWallet } from '../../lib'

const Clover = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    const { clover_solana } = window

    if (!clover_solana?.isCloverWallet)
      return window.notify({
        type: 'warning',
        description:
          'Clover Wallet is not installed. If this is the first time you install Clover wallet, please restart your browser to complete the setup.',
      })
    const wallet = new CloverWallet()
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
          <Avatar size={32} shape="square" src={CLOVER} />
        </Col>
        <Col>
          <Typography.Text>Clover</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default Clover
