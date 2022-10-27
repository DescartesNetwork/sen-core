import { useMemo, useState } from 'react'

import { Button, Col, Drawer, Row, Space, Switch, Typography } from 'antd'
import { MenuSystemItem } from 'view/sidebar/constants'
import NotificationDrawer from './notificationDrawer'

import { useNotificationsData } from 'hooks/useNotificationsData'
import { useUserNotification } from 'hooks/useUserNotification'
import { RootDispatch, useRootDispatch } from 'store'
import { upsetUserNotification } from 'store/notifications.reducer'

type NotificationProps = { open?: boolean; onClose?: () => void }

const Notification = ({
  open = false,
  onClose = () => {},
}: NotificationProps) => {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const notifications = useNotificationsData()
  const { notificationMark, readIds, userAddress } = useUserNotification()

  const dispatch = useRootDispatch<RootDispatch>()

  const unreadNotifications = useMemo(() => {
    if (!notificationMark) return notifications
    const markIndex = notifications.findIndex(
      (val) => val._id === notificationMark,
    )
    return notifications
      .slice(0, markIndex)
      .filter((notification) => !readIds.includes(notification._id))
  }, [notifications, notificationMark, readIds])

  const onMarkAllAsRead = async () => {
    const newUserNotification = {
      notificationMark: notifications[0]._id,
      readIds: [],
      userAddress,
    }
    await dispatch(
      upsetUserNotification({ userNotification: newUserNotification }),
    )
  }

  const markAllAsReadVisible = useMemo(() => {
    return notifications.length > 0 && notifications[0]._id !== notificationMark
  }, [notifications, notificationMark])

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
      <NotificationDrawer
        notifications={unreadOnly ? unreadNotifications : notifications}
      />
    </Drawer>
  )
}

export default Notification
