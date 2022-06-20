import { Col, Row, Typography, Card } from 'antd'

const ReviewManual = () => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text type="secondary">Manual</Typography.Text>
      </Col>
      <Card bordered={false}>
        <Col span={24}>
          <Typography.Title level={5}>
            Why should I create a backup?
          </Typography.Title>
          <ul style={{ paddingLeft: 16 }}>
            <li>
              <Typography.Text>
                Because Sentre never collects your data, so the data is locally
                available. Thus, it's nescessary to backup your data in case
                your device is broken or suddenly lost.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text>
                You can move data in the current device to a new one.
              </Typography.Text>
            </li>
          </ul>
        </Col>
        <Col span={24}>
          <Typography.Title level={5}>What is IPFS?</Typography.Title>
          <ul style={{ paddingLeft: 16 }}>
            <li>
              <Typography.Text>
                IPFS is a decentralized database. By high availability, data can
                be fetched via an internet connection.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text>
                Everyone can publicly access data on it, and even your stored
                data.
              </Typography.Text>
            </li>
          </ul>
        </Col>
        <Col span={24}>
          <Typography.Title level={5} type="danger">
            Be aware of privacy!
          </Typography.Title>
          <ul style={{ paddingLeft: 16 }}>
            <li>
              <Typography.Text>
                Make sure that no sensitive data is in the storage.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text>
                It's rarely happened, but there is a little chance of losing
                your data on IPFS.
              </Typography.Text>
            </li>
          </ul>
        </Col>
      </Card>
    </Row>
  )
}
export default ReviewManual
