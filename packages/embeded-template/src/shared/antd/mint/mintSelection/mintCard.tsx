import { Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'shared/antd/mint'

export type MintSelectionProps = {
  mintAddress: string
  onClick?: (mintAddress: string) => void
}

const MintCard = ({ mintAddress, onClick = () => {} }: MintSelectionProps) => {
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
            <Typography.Text>
              <MintSymbol mintAddress={mintAddress} />
            </Typography.Text>
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
