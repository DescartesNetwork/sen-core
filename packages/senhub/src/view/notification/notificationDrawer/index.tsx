import { Fragment, useCallback, useMemo } from 'react'

import { Button, Col, Empty, Row, Space, Typography } from 'antd'
import NotificationItem from './notificationItem'

import { RootDispatch, useRootDispatch } from 'store'
import { useNotificationPagination } from 'hooks/useNotificationPagination'
import {
  DEFAUlT_LIMIT,
  getNotifications,
  NotificationData,
  upsetPagination,
} from 'store/notifications.reducer'

export type NotificationDrawerProps = {
  notifications: NotificationData[]
}

const NotificationDrawer = ({ notifications }: NotificationDrawerProps) => {
  const { offset, limit } = useNotificationPagination()
  const dispatch = useRootDispatch<RootDispatch>()

  const disabled = useMemo(
    () => notifications.length < offset,
    [offset, notifications.length],
  )

  const onViewMore = useCallback(async () => {
    await dispatch(
      getNotifications({
        offset,
        limit,
      }),
    )
    await dispatch(
      upsetPagination({
        offset: limit,
        limit: limit + DEFAUlT_LIMIT,
      }),
    )
  }, [dispatch, limit, offset])

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
