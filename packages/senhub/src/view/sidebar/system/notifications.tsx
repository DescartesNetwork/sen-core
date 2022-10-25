import { Fragment, useMemo, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import MenuItem from '../components/menuItem'
import { Col, Row, Badge } from 'antd'
import Notification from 'view/notification'

import { useNotifications } from 'hooks/useNotifications'
import { MenuSystemItem } from '../constants'
import { useUserNotification } from 'hooks/useUserNotification'

type NotificationsProps = { visible?: boolean }
const Notifications = ({ visible }: NotificationsProps) => {
  const [open, setOpen] = useState(false)
  const notifications = useNotifications()
  const userNotification = useUserNotification()

  const newNotificationAmount = useMemo(() => {
    if (!userNotification.notificationMark)
      return notifications.filter(
        (notification) => !userNotification.readIds?.includes(notification._id),
      ).length
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
      <Notification open={open} onClose={() => setOpen(false)} />
    </Fragment>
  )
}

export default Notifications
