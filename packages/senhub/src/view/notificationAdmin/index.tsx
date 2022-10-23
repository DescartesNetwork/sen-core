import React from 'react'

import { Col, Row, Typography } from 'antd'
import SearchAndFilter from './searchAndFilter'
import NewNotification from './newNotification'
import NotificationTable, { DataType } from './notificationTable'

import { useNotifications } from 'hooks/useNotifications'
import { NotificationsState } from 'store/notifications/notifications.reducer'

const formatNotificationsData = (
  notifications: NotificationsState,
): DataType[] => {
  const data: DataType[] = []
  for (const key in notifications) {
    const notification = notifications[key]
    data.push({
      key: notification._id,
      time: notification.broadcastedAt,
      image: notification.thumbnail,
      title: notification.title,
      description: notification.content,
    })
  }
  return data
}

const NotificationAdmin = () => {
  const notifications = useNotifications()

  return (
    <Row gutter={[24, 24]}>
      <Col>
        <Typography.Title level={1}>Notifications</Typography.Title>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={8}>
            <SearchAndFilter />
          </Col>
          <Col flex="auto">
            <NewNotification />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <NotificationTable data={formatNotificationsData(notifications)} />
      </Col>
    </Row>
  )
}

export default NotificationAdmin
