import IonIcon from '@sentre/antd-ionicon'
import { Card, Col, Row, Space, Tooltip, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'shared/antd/mint'
import { useJupiterTokens } from './hooks/useJupiterTokens'

export type MintSelectionProps = {
  mintAddress: string
  onClick?: (mintAddress: string) => void
}

const Verification = () => {
  return (
    <Tooltip title={'Safe to Go'}>
      <IonIcon
        name="checkmark-circle"
        style={{
          color: '#18A0FB',
          backgroundColor: '#fafafa',
          borderRadius: 6,
          fontSize: 12,
        }}
      />
    </Tooltip>
  )
}

const MintCard = ({ mintAddress, onClick = () => {} }: MintSelectionProps) => {
  const jptTokens = useJupiterTokens()
  return (
    <Card
      bodyStyle={{ padding: 8 }}
      style={{ boxShadow: 'unset', cursor: 'pointer' }}
      bordered={false}
      onClick={() => onClick(mintAddress)}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <MintAvatar mintAddress={mintAddress} size={36} />
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Space>
              <Typography.Text>
                <MintSymbol mintAddress={mintAddress} />
              </Typography.Text>
              {jptTokens?.verify(mintAddress) && <Verification />}
            </Space>

            <Typography.Text type="secondary" className="caption">
              <MintName mintAddress={mintAddress} />
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default MintCard
