import { Avatar, Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { isAddress, shortenAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

type WalletConnectedProps = { onDisconnect?: () => void; visible?: boolean }
const WalletConnected = ({
  onDisconnect,
  visible = false,
}: WalletConnectedProps) => {
  const walletAddress = useWalletAddress()

  const walletBtnStyle = { padding: 0, width: 'auto', height: 'auto' }

  return (
    <Card
      bordered={false}
      style={{ background: 'transparent', borderRadius: 12 }}
      bodyStyle={{ padding: 8 }}
    >
      <Row gutter={[12, 12]} align="middle" wrap={false}>
        <Col>
          <Avatar size={32}>
            {isAddress(walletAddress) && walletAddress.substring(0, 2)}
          </Avatar>
        </Col>
        {visible && (
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Space>
                <Typography.Text style={{ fontWeight: 600 }}>
                  {shortenAddress(walletAddress)}
                </Typography.Text>
                <Button
                  type="text"
                  style={walletBtnStyle}
                  icon={<IonIcon name="copy-outline" />}
                />
                <Button
                  type="text"
                  style={walletBtnStyle}
                  icon={<IonIcon name="qr-code-outline" />}
                />
              </Space>
              <Typography.Text type="secondary" onClick={onDisconnect}>
                Name
              </Typography.Text>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  )
}

export default WalletConnected
