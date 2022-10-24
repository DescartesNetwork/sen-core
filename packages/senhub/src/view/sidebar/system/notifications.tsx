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

import { useWalletAddress } from 'hooks/useWallet'
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
  const walletAddress = useWalletAddress()
  const dispatch = useRootDispatch<RootDispatch>()

  const newNotificationAmount = useMemo(() => {
    const notificationArray = Object.keys(notifications)
    const markIndex = notificationArray.findIndex(
      (val) => val === userNotification.notificationMark,
    )
    return notificationArray
      .slice(0, markIndex)
      .filter(
        (notificationId) =>
          !userNotification.notificationMark.includes(notificationId),
      ).length
  }, [notifications, userNotification.notificationMark])

  const filteredNotifications = useMemo(() => {
    const notificationArray = Object.keys(notifications)
      .map((key) => ({
        ...notifications[key],
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    if (unreadOnly) {
      const markIndex = notificationArray.findIndex(
        (val) => val._id === userNotification.notificationMark,
      )
      return notificationArray
        .slice(0, markIndex)
        .filter(
          (notification) =>
            !userNotification.notificationMark.includes(notification._id),
        )
    }

    return notificationArray
  }, [notifications, unreadOnly, userNotification.notificationMark])

  const onMarkAllAsRead = async () => {
    await dispatch(
      upsetUserNotifications({ userNotificationId: walletAddress }),
    )
  }

  const markAllAsReadVisible = useMemo(() => {
    const notificationKeys = Object.keys(notifications)
    if (
      notificationKeys[notificationKeys.length - 1] ===
      userNotification.notificationMark
    )
      return false
    return true
  }, [notifications, userNotification.notificationMark])

  return (
    <Fragment>
      <MenuItem
        icon={
          !visible ? (
            <Badge count={newNotificationAmount}>
              <IonIcon name="notifications-outline" />
            </Badge>
          ) : (
            <IonIcon name="notifications-outline" />
          )
        }
        value={MenuSystemItem.Notify}
        onClick={() => {
          setOpen(true)
        }}
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
                    />
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between" wrap={false} align="middle">
                <Col flex="auto">
                  <Typography.Text style={{ fontSize: 12 }} type="secondary">
                    NEAREST
                  </Typography.Text>
                </Col>
                {markAllAsReadVisible && (
                  <Col>
                    <Button
                      style={{
                        fontSize: 12,
                        padding: 0,
                        color: '#5D6CCF',
                        background: 'none',
                      }}
                      type="text"
                      onClick={onMarkAllAsRead}
                    >
                      Mark all as read
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
        bodyStyle={{ padding: 0 }}
      >
        <NotificationDrawer notifications={filteredNotifications} />
      </Drawer>
    </Fragment>
  )
}

export default Notifications
