import { Fragment, useCallback, useMemo } from 'react'

import { Button, Col, Empty, Row, Space, Typography } from 'antd'
import NotificationItem from './notificationItem'

import { RootDispatch, useRootDispatch } from 'store'
import {
  getNotifications,
  getUnreadNotifications,
  NotificationData,
} from 'store/notifications.reducer'
import { useOffset, useUserNotification } from 'hooks/useNotifications'

export type NotificationDrawerProps = {
  notifications: NotificationData[]
  unreadOnly: boolean
}

const NotificationDrawer = ({
  notifications,
  unreadOnly,
}: NotificationDrawerProps) => {
  const offset = useOffset()
  const dispatch = useRootDispatch<RootDispatch>()
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
            imageStyle={{
              height: 60,
            }}
            description={
              <Typography.Text>You have no notification</Typography.Text>
            }
          />
        </Col>
      ) : (
        <Fragment>
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
            <Col style={{ marginTop: 8 }} span={24}>
              <Space
                style={{ width: '100%' }}
                direction="vertical"
                align="center"
              >
                <Button onClick={onViewMore}>View More</Button>
              </Space>
            </Col>
          )}
        </Fragment>
      )}
    </Row>
  )
}

export default NotificationDrawer
