import moment from 'moment'
import { MouseEvent, useMemo } from 'react'

import { Col, Row, Image, Radio, Tooltip, Typography } from 'antd'

import { NotificationData } from 'store/notifications/notifications.reducer'
import { RootDispatch, useRootDispatch } from 'store'
import { useUserNotification } from 'hooks/useUserNotification'
import { useNotifications } from 'hooks/useNotifications'
import { upsetUserNotification } from 'store/notifications/userNotification.reducer'
import NormalLogo from 'static/images/notification/normal-notification.png'
import QuestLogo from 'static/images/notification/quest.png'

type NotificationItemProps = {
  notification: NotificationData
}
const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { _id, content, broadcastedAt, title, type } = notification
  const userNotification = useUserNotification()
  const notifications = useNotifications()
  const dispatch = useRootDispatch<RootDispatch>()

  const logo = useMemo(() => {
    return type === 'sentre' ? NormalLogo : QuestLogo
  }, [type])

  const seen = useMemo(() => {
    const notificationMarkIndex = notifications.findIndex(
      (val) => val._id === userNotification.notificationMark,
    )
    const notificationIndex = notifications.findIndex((val) => val._id === _id)

    if (notificationIndex >= notificationMarkIndex) return true

    if (userNotification.readIds.includes(_id)) return true
    return false
  }, [_id, notifications, userNotification])

  const onRead = async (e: MouseEvent) => {
    e.stopPropagation()

    if (seen) return
    return await dispatch(
      upsetUserNotification({
        _id,
        userNotificationId: userNotification._id,
      }),
    )
  }

  const onAction = async () => {
    if (!seen)
      dispatch(
        upsetUserNotification({
          _id,
          userNotificationId: userNotification._id,
        }),
      )
    window.open(notification?.action, 'blank')
  }

  return (
    <Row gutter={[12, 12]} wrap={false} onClick={onAction}>
      <Col span={4}>
        <Image
          src={logo}
          alt="alt"
          style={{ borderRadius: 12 }}
          preview={false}
        />
      </Col>
      <Col flex="auto">
        <Row gutter={[4, 4]}>
          <Col span={24}>
            <Typography.Title
              style={{ marginBottom: 0, fontSize: 14 }}
              level={5}
            >
              {title}
            </Typography.Title>
            <Typography.Text
              style={{ marginBottom: 0, fontSize: 12 }}
              type="secondary"
            >
              {content}
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {moment(broadcastedAt).fromNow()}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
      <Col onClick={onRead} span={3}>
        {!seen ? (
          <Tooltip
            title={
              <Typography.Text style={{ color: '#E9E9EB' }}>
                Mark as read
              </Typography.Text>
            }
          >
            <Radio checked={!seen} />
          </Tooltip>
        ) : (
          <Radio checked={!seen} />
        )}
      </Col>
    </Row>
  )
}

export default NotificationItem
