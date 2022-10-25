import { Button, Col, Drawer, Row, Space, Switch, Typography } from 'antd'
import { useNotifications } from 'hooks/useNotifications'
import { useUserNotification } from 'hooks/useUserNotification'
import React, { useMemo, useState } from 'react'
import { RootDispatch, useRootDispatch } from 'store'
import { updateReadNotifications } from 'store/notifications/userNotification.reducer'
import { MenuSystemItem } from 'view/sidebar/constants'
import NotificationDrawer from './notificationDrawer'

type NotificationProps = { open?: boolean; onClose?: () => void }
const Notification = ({ open, onClose = () => {} }: NotificationProps) => {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const notifications = useNotifications()
  const userNotification = useUserNotification()

  const dispatch = useRootDispatch<RootDispatch>()

  const filteredNotifications = useMemo(() => {
    if (unreadOnly) {
      const markIndex = notifications.findIndex(
        (val) => val._id === userNotification.notificationMark,
      )
      return notifications
        .slice(0, markIndex)
        .filter(
          (notification) =>
            !userNotification.readIds.includes(notification._id),
        )
    }

    return notifications
  }, [
    notifications,
    unreadOnly,
    userNotification.notificationMark,
    userNotification.readIds,
  ])

  const onMarkAllAsRead = async () => {
    await dispatch(updateReadNotifications())
  }

  const markAllAsReadVisible = useMemo(() => {
    if (notifications[0]?._id === userNotification.notificationMark)
      return false
    return true
  }, [notifications, userNotification.notificationMark])

  return (
    <Drawer
      title={
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row justify="center">
              <Col flex="auto">
                <Typography.Title level={4}>
                  {MenuSystemItem.Notify}
                </Typography.Title>
              </Col>
              <Col>
                <Space>
                  <Typography.Text style={{ fontSize: 14 }}>
                    Unread only
                  </Typography.Text>
                  <Switch
                    checked={unreadOnly}
                    onChange={() => setUnreadOnly(!unreadOnly)}
                    size="small"
                  />
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="space-between" wrap={false} align="middle">
              <Col flex="auto">
                <Typography.Text style={{ fontSize: 12 }} type="secondary">
                  RECENTLY
                </Typography.Text>
              </Col>
              {markAllAsReadVisible && (
                <Col>
                  <Button
                    style={{
                      padding: 0,
                      background: 'none',
                    }}
                    type="text"
                    onClick={onMarkAllAsRead}
                  >
                    <Typography.Text
                      style={{
                        fontSize: 12,
                        color: '#5D6CCF',
                      }}
                    >
                      Mark all as read
                    </Typography.Text>
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      }
      placement="left"
      closable={false}
      onClose={() => onClose()}
      open={open}
      headerStyle={{ borderBottom: 'none' }}
      bodyStyle={{ padding: 0, paddingBottom: 12 }}
    >
      <NotificationDrawer notifications={filteredNotifications} />
    </Drawer>
  )
}

export default Notification
