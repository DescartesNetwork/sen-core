import { Fragment, useCallback, useMemo } from 'react'

import { Button, Col, Empty, Row, Space, Typography } from 'antd'
import NotificationItem from './notificationItem'

import {
  getNotifications,
  NotificationData,
} from 'store/notifications/notifications.reducer'
import { RootDispatch, useRootDispatch } from 'store'
import { useUserNotification } from 'hooks/useUserNotification'
import {
  LIMIT,
  upsetPagination,
} from 'store/notifications/userNotification.reducer'

export type NotificationDrawerProps = {
  notifications: NotificationData[]
}

const NotificationDrawer = ({ notifications }: NotificationDrawerProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const userNotification = useUserNotification()

  const disabled = useMemo(
    () => notifications.length < userNotification.offset,
    [userNotification.offset, notifications.length],
  )

  const onViewMore = useCallback(async () => {
    await dispatch(
      getNotifications({
        offset: userNotification.offset,
        limit: userNotification.limit,
        broadcasted: true,
      }),
    )
    await dispatch(
      upsetPagination({
        offset: userNotification.limit + LIMIT,
        limit: userNotification.limit + LIMIT,
      }),
    )
  }, [dispatch, userNotification])

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
              <Typography.Text>You have no notification</Typography.Text>
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
