import { Col, Empty, Row, Typography } from 'antd'
import NotificationItem from './notificationItem'

import { NotificationData } from 'store/notifications/notifications.reducer'

export type NotificationDrawerProps = {
  notifications: NotificationData[]
}

const NotificationDrawer = ({ notifications }: NotificationDrawerProps) => {
  return (
    <Row>
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
