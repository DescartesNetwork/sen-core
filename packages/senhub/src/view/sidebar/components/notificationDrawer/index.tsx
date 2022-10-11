import { Col, Empty, Row, Typography } from 'antd'
import NotificationItem from './notificationItem'

import { DappData } from 'store/notifications.reducer'

export type NotificationDrawerProps = {
  notifications: {
    id: string
    dappId: DappData
    content: string
    name: string
    seen: boolean
    time: string
  }[]
}

const NotificationDrawer = ({ notifications }: NotificationDrawerProps) => {
  return (
    <Row gutter={[12, 12]}>
      {!notifications.length ? (
        <Col span={24}>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={
              <Typography.Text>You have no notifications</Typography.Text>
            }
          />
        </Col>
      ) : (
        notifications.map((notification, index) => (
          <Col key={index} span={24} className="notification-item">
            <NotificationItem notification={notification} />
          </Col>
        ))
      )}
    </Row>
  )
}

export default NotificationDrawer
