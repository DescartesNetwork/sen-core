import { Fragment, useMemo, useState } from 'react'
import axios from 'axios'

import IonIcon from '@sentre/antd-ionicon'
import MenuItem from '../components/menuItem'
import { Button, Col, Drawer, Row, Space, Switch, Typography } from 'antd'
import NotificationDrawer from '../components/notificationDrawer'

import { MenuSystemItem } from '../constants'

import { useNotifications } from 'hooks/useNotifications'
import { RootDispatch, useRootDispatch } from 'store'
import { upsetAllNotifications } from 'store/notifications.reducer'
import configs from 'configs'

const { api } = configs

type NotificationsProps = { visible?: boolean }
const Notifications = ({ visible }: NotificationsProps) => {
  const [open, setOpen] = useState(false)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const notifications = useNotifications()
  const dispatch = useRootDispatch<RootDispatch>()

  const filteredNotifications = useMemo(() => {
    const notificationArray = Object.keys(notifications).map((key) => ({
      ...notifications[key],
      id: key,
    }))
    if (unreadOnly)
      return notificationArray.filter(
        (notification) => notification.seen === false,
      )
    return notificationArray
  }, [notifications, unreadOnly])

  const markAllAsRead = async () => {
    console.log('marl all as read')
    dispatch(
      upsetAllNotifications({
        seen: true,
      }),
    )
    await axios.patch(api.notifications.index, {
      seen: true,
    })
  }

  const markAllAsReadVisible = useMemo(() => {
    for (const id in notifications) {
      if (!notifications[id].seen) {
        return true
      }
    }
    return false
  }, [notifications])

  return (
    <Fragment>
      <MenuItem
        icon={<IonIcon name="notifications-outline" />}
        value={MenuSystemItem.Notify}
        onClick={() => {
          setOpen(true)
        }}
        name={visible}
      >
        {MenuSystemItem.Notify}
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
                  <Typography.Text style={{ fontSize: 12 }}>
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
                      onClick={markAllAsRead}
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
