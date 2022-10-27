import { Fragment, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import MenuItem from '../components/menuItem'
import { Col, Row, Badge } from 'antd'
import Notification from 'view/notification'

import { MenuSystemItem } from '../constants'
import { useUnreadNotificationCount } from 'hooks/useUnreadNotificationCount'

type NotificationsProps = { visible?: boolean }

const Notifications = ({ visible }: NotificationsProps) => {
  const [open, setOpen] = useState(false)
  const unreadCount = useUnreadNotificationCount()

  return (
    <Fragment>
      <MenuItem
        icon={
          !visible ? (
            <Badge count={unreadCount}>
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
          unreadCount !== 0 ? (
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
              {unreadCount}
            </div>
          ) : null
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
