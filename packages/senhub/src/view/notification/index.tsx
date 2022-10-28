import { useCallback, useMemo, useState } from 'react'

import { Button, Col, Drawer, Row, Space, Switch, Typography } from 'antd'
import { MenuSystemItem } from 'view/sidebar/constants'
import NotificationDrawer from './notificationDrawer'

import { RootDispatch, useRootDispatch } from 'store'
import {
  DEFAUlT_LIMIT,
  getNotifications,
  getUnreadNotifications,
  upsetOffset,
  upsetUserNotification,
} from 'store/notifications.reducer'
import { useNotifications } from 'hooks/useNotifications'

type NotificationProps = { open?: boolean; onClose?: () => void }

const Notification = ({
  open = false,
  onClose = () => {},
}: NotificationProps) => {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const {
    userNotification: { notificationMark, userAddress },
    notificationsData,
  } = useNotifications()

  const dispatch = useRootDispatch<RootDispatch>()

  const onMarkAllAsRead = async () => {
    const newUserNotification = {
      notificationMark: notificationsData[0]._id,
      readIds: [],
      userAddress,
    }
    await dispatch(
      upsetUserNotification({ userNotification: newUserNotification }),
    )
  }

  const markAllAsReadVisible = useMemo(() => {
    return (
      notificationsData.length > 0 &&
      notificationsData[0]._id !== notificationMark
    )
  }, [notificationsData, notificationMark])

  const onUnreadOnly = useCallback(async () => {
    setUnreadOnly(!unreadOnly)
    dispatch(upsetOffset(DEFAUlT_LIMIT))
    if (!unreadOnly) {
      return await dispatch(getUnreadNotifications({ offset: 0, isNew: true }))
    }
    return await dispatch(getNotifications({ offset: 0, isNew: true }))
  }, [dispatch, unreadOnly])

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
                    onChange={onUnreadOnly}
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
        notifications={notificationsData}
        unreadOnly={unreadOnly}
      />
    </Drawer>
  )
}

export default Notification
