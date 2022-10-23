import { Fragment, useEffect, useState } from 'react'

import { Button, Col, Empty, Row, Space, Typography } from 'antd'
import NotificationItem from './notificationItem'

import {
  getNotifications,
  NotificationData,
} from 'store/notifications/notifications.reducer'
import { useNotificationPagination } from 'hooks/useNotificationPagination'
import { RootDispatch, useRootDispatch } from 'store'
import { LIMIT, upsetPagination } from 'store/notifications/pagination.reducer'

export type NotificationDrawerProps = {
  notifications: NotificationData[]
}

const NotificationDrawer = ({ notifications }: NotificationDrawerProps) => {
  const [disabled, setDisabled] = useState(true)
  const notificationPagination = useNotificationPagination()
  const dispatch = useRootDispatch<RootDispatch>()

  useEffect(() => {
    if (notifications.length < notificationPagination.limit)
      return setDisabled(true)
    setDisabled(false)
  }, [notificationPagination.limit, notifications.length])

  const onViewMore = async () => {
    const newNotifications = await dispatch(
      getNotifications({
        offset: notificationPagination.offset,
        limit: notificationPagination.limit,
        broadcasted: true,
      }),
    )
    if (Object.keys(newNotifications).length === LIMIT)
      await dispatch(
        upsetPagination({
          offset: notificationPagination.limit + LIMIT,
          limit: notificationPagination.limit + LIMIT,
        }),
      )
  }
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
        <Fragment>
          {notifications.map((notification, index) => (
            <Col key={index} span={24} className="notification-item">
              <NotificationItem notification={notification} />
            </Col>
          ))}
          <Col style={{ marginTop: 8 }} span={24}>
            <Space
              style={{ width: '100%' }}
              direction="vertical"
              align="center"
            >
              <Button onClick={onViewMore} disabled={disabled}>
                View More
              </Button>
            </Space>
          </Col>
        </Fragment>
      )}
    </Row>
  )
}

export default NotificationDrawer
