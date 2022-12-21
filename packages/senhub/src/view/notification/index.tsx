import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Col, Drawer, Row, Space, Switch, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MenuSystemItem } from 'view/sidebar/constants'
import NotificationDrawer from './notificationDrawer'

import { RootDispatch, useRootDispatch } from 'store'
import {
  getNotifications,
  getUnreadNotifications,
  setNotifications,
  upsetUserNotification,
} from 'store/notifications.reducer'
import {
  useNotificationsSelector,
  useUserNotification,
} from 'hooks/useNotifications'
import { useIsLogin } from 'hooks/useWallet'

type NotificationProps = { open?: boolean; onClose?: () => void }

const Notification = ({
  open = false,
  onClose = () => {},
}: NotificationProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const [unreadOnly, setUnreadOnly] = useState(false)
  const isLogin = useIsLogin()
  const { notificationMark } = useUserNotification()
  const { _id: latestNotiId } = useNotificationsSelector(([noti]) => noti) || {}

  const onMarkAllAsRead = useCallback(async () => {
    if (!latestNotiId) return
    const userNotification = {
      notificationMark: latestNotiId,
      readIds: [],
    }
    await dispatch(upsetUserNotification({ userNotification }))

    if (unreadOnly) await dispatch(setNotifications({ notifications: [] }))
  }, [dispatch, latestNotiId, unreadOnly])

  const isUnreadExist = useMemo(
    () => latestNotiId && latestNotiId !== notificationMark && isLogin,
    [isLogin, latestNotiId, notificationMark],
  )

  useEffect(() => {
    const fetchNoti = unreadOnly ? getUnreadNotifications : getNotifications
    dispatch(fetchNoti({ offset: 0, isNew: true }))
  }, [unreadOnly, dispatch])

  return (
    <Drawer
      title={
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row gutter={[4, 4]} align="middle">
              <Col>
                <Button
                  type="text"
                  icon={<IonIcon name="chevron-back" />}
                  style={{ marginLeft: -8 }}
                  onClick={onClose}
                />
              </Col>
              <Col flex="auto">
                <Typography.Title level={4}>
                  {MenuSystemItem.Notify}
                </Typography.Title>
              </Col>
              <Col>
                <Space>
                  <Typography.Text className="caption">
                    Unread only
                  </Typography.Text>
                  <Switch
                    checked={unreadOnly}
                    onChange={() => setUnreadOnly(!unreadOnly)}
                    size="small"
                    disabled={!isLogin}
                  />
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="space-between" wrap={false} align="bottom">
              <Col flex="auto">
                <Typography.Text className="caption">RECENT</Typography.Text>
              </Col>
              {isUnreadExist && (
                <Col>
                  <Button
                    style={{ marginRight: -8 }}
                    type="text"
                    size="small"
                    onClick={onMarkAllAsRead}
                  >
                    <Typography.Text
                      className="caption"
                      style={{ color: '#5D6CCF' }}
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
      onClose={onClose}
      open={open}
      headerStyle={{ border: 'none' }}
      bodyStyle={{ padding: 0, paddingBottom: 12 }}
    >
      <NotificationDrawer unreadOnly={unreadOnly} />
    </Drawer>
  )
}

export default Notification
