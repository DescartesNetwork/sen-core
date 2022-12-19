import { Fragment, useState } from 'react'

import { Badge } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import MenuItem from '../components/menuItem'
import Notification from 'view/notification'

import { MenuSystemItem } from '../constants'
import { useUnreadCount } from 'hooks/useNotifications'

type NotificationsProps = { visible?: boolean }

const HIDDEN_BADGE = 0

const Notifications = ({ visible }: NotificationsProps) => {
  const [open, setOpen] = useState(false)
  const unreadCount = useUnreadCount()

  return (
    <Fragment>
      <MenuItem
        icon={
          <Badge count={visible ? HIDDEN_BADGE : unreadCount}>
            <IonIcon name="notifications-outline" style={{ fontSize: 18 }} />
          </Badge>
        }
        value={MenuSystemItem.Notify}
        onClick={() => setOpen(true)}
        name={visible}
        postfix={
          unreadCount ? (
            <div
              style={{
                color: '#F9575E',
                background: 'rgba(249, 87, 94, 0.1)',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 12,
              }}
            >
              {unreadCount}
            </div>
          ) : null
        }
        tooltip
      >
        {MenuSystemItem.Notify}
      </MenuItem>
      <Notification open={open} onClose={() => setOpen(false)} />
    </Fragment>
  )
}

export default Notifications
