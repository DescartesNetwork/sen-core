import { Row, Col, Switch, Typography, Card, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const Notification = () => {
  return (
    <Card className="card-setting" hoverable bordered={false}>
      <Row align="middle">
        <Col flex="auto">
          <Space size={12}>
            <IonIcon
              style={{
                color: '#FA57CC',
                background: 'rgba(250, 87, 204, 0.1)',
              }}
              className="theme-icon"
              name="notifications-outline"
            />
            <Space size={0} direction="vertical">
              <Typography.Text>Push notifications</Typography.Text>
              <Typography.Text type="secondary" className="caption">
                Show good new things.
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Switch size="default" />
        </Col>
      </Row>
    </Card>
  )
}

export default Notification
