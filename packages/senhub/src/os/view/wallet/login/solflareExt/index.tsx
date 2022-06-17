import { Row, Card, Col, Avatar, Typography } from 'antd'

import SOLFLARE from 'os/static/images/wallet/solflare.png'
import { useRootDispatch, RootDispatch } from 'os/store'
import { connectWallet } from 'os/store/wallet.reducer'
import { SolflareExtensionWallet } from '../../lib'

const SolflareExtension = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const connect = async () => {
    const { solflare } = window
    if (!solflare)
      return window.notify({
        type: 'warning',
        description:
          'Solflare Wallet is not installed. If this is the first time you install Solflare wallet, please restart your browser to complete the setup.',
      })
    const wallet = new SolflareExtensionWallet()
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
          <Avatar size={32} shape="square" src={SOLFLARE} />
        </Col>
        <Col>
          <Typography.Text>Solflare Extension</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default SolflareExtension
