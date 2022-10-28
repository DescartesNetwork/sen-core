import { useCallback, useMemo } from 'react'

import { Button, Col, Empty, Row, Typography } from 'antd'
import NotificationItem from './notificationItem'

import { RootDispatch, useRootDispatch } from 'store'
import {
  getNotifications,
  getUnreadNotifications,
} from 'store/notifications.reducer'
import {
  useNotifications,
  useOffset,
  useUserNotification,
} from 'hooks/useNotifications'

export type NotificationDrawerProps = {
  unreadOnly?: boolean
}

const NotificationDrawer = ({
  unreadOnly = false,
}: NotificationDrawerProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const offset = useOffset()
  const notifications = useNotifications()
  const { notificationMark } = useUserNotification()

  const disabled = useMemo(
    () => notifications.length < offset,
    [offset, notifications.length],
  )

  const markNotificationIndex = useMemo(() => {
    return notifications.findIndex((val) => val._id === notificationMark)
  }, [notificationMark, notifications])

  const onViewMore = useCallback(async () => {
    if (!unreadOnly) {
      return await dispatch(
        getNotifications({
          offset,
        }),
      )
    }
    return await dispatch(
      getUnreadNotifications({
        offset,
      }),
    )
  }, [dispatch, offset, unreadOnly])

  return (
    <Row>
      {!notifications.length ? (
        <Col span={24}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 60 }}
            description={
              <Typography.Text>You have no notification</Typography.Text>
            }
          />
        </Col>
      ) : (
        <Col span={24}>
          <Row gutter={[0, 8]} justify="center">
            {notifications.map((notification, index) => {
              const isBeforeMark =
                markNotificationIndex !== -1 && markNotificationIndex <= index
              return (
                <Col key={index} span={24} className="notification-item">
                  <NotificationItem
                    notification={notification}
                    isBeforeMark={isBeforeMark}
                  />
                </Col>
              )
            })}
            {!disabled && (
              <Col>
                <Button onClick={onViewMore}>View More</Button>
              </Col>
            )}
          </Row>
        </Col>
      )}
    </Row>
  )
}

export default NotificationDrawer
