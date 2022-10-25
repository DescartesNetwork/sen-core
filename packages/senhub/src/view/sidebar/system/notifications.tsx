import { Fragment, useMemo, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import MenuItem from '../components/menuItem'
import {
  Button,
  Col,
  Drawer,
  Row,
  Space,
  Switch,
  Typography,
  Badge,
} from 'antd'
import NotificationDrawer from '../components/notificationDrawer'

import { useNotifications } from 'hooks/useNotifications'
import { RootDispatch, useRootDispatch } from 'store'
import { MenuSystemItem } from '../constants'
import { useUserNotification } from 'hooks/useUserNotification'
import { upsetUserNotifications } from 'store/notifications/userNotification.reducer'

type NotificationsProps = { visible?: boolean }
const Notifications = ({ visible }: NotificationsProps) => {
  const [open, setOpen] = useState(false)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const notifications = useNotifications()
  const userNotification = useUserNotification()
  const dispatch = useRootDispatch<RootDispatch>()

  const newNotificationAmount = useMemo(() => {
    const markIndex = notifications.findIndex(
      (val) => val._id === userNotification.notificationMark,
    )
    return notifications
      .slice(0, markIndex)
      .filter(
        (notification) => !userNotification.readIds?.includes(notification._id),
      ).length
  }, [
    notifications,
    userNotification.notificationMark,
    userNotification.readIds,
  ])

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
    await dispatch(
      upsetUserNotifications({ userNotificationId: userNotification?._id }),
    )
  }

  const markAllAsReadVisible = useMemo(() => {
    if (notifications[0]?._id === userNotification.notificationMark)
      return false
    return true
  }, [notifications, userNotification.notificationMark])

  return (
    <Fragment>
      <MenuItem
        icon={
          !visible ? (
            <Badge count={newNotificationAmount}>
              <IonIcon name="notifications-outline" style={{ fontSize: 18 }} />
            </Badge>
          ) : (
            <IonIcon name="notifications-outline" style={{ fontSize: 18 }} />
          )
        }
        value={MenuSystemItem.Notify}
        onClick={() => setOpen(true)}
        name={visible}
        postfix={
          <div
            style={{
              color: '#F9575E',
              background: 'rgba(249, 87, 94, 0.1)',
              width: 22,
              height: 22,
              borderRadius: 4,
              fontSize: 12,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {newNotificationAmount}
          </div>
        }
      >
        <Row>
          <Col>{MenuSystemItem.Notify}</Col>
        </Row>
      </MenuItem>
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
        onClose={() => {
          setOpen(false)
        }}
        open={open}
        headerStyle={{ borderBottom: 'none' }}
        bodyStyle={{ padding: 0, paddingBottom: 12 }}
      >
        <NotificationDrawer notifications={filteredNotifications} />
      </Drawer>
    </Fragment>
  )
}

export default Notifications
