import moment from 'moment'
import { useMemo } from 'react'

import { Col, Row, Image, Radio, Tooltip, Typography } from 'antd'

import { NotificationData } from 'store/notifications/notifications.reducer'
import { RootDispatch, useRootDispatch } from 'store'
import { useUserNotification } from 'hooks/useUserNotification'
import { useNotifications } from 'hooks/useNotifications'
import { upsetUserNotification } from 'store/notifications/userNotification.reducer'

type NotificationItemProps = {
  notification: NotificationData
}
const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { _id, content, broadcastedAt, thumbnail, title } = notification
  const userNotification = useUserNotification()
  const notifications = useNotifications()
  const dispatch = useRootDispatch<RootDispatch>()

  const seen = useMemo(() => {
    const notificationMarkIndex = Object.keys(notifications).findIndex(
      (val) => val === userNotification.notificationMark,
    )
    const notificationIndex = Object.keys(notifications).findIndex(
      (val) => val === _id,
    )
    if (notificationIndex <= notificationMarkIndex) return true

    if (userNotification.readIds.includes(_id)) return true
    return false
  }, [
    _id,
    notifications,
    userNotification.notificationMark,
    userNotification.readIds,
  ])

  const onReadOrUnread = async () => {
    if (seen) return
    return await dispatch(
      upsetUserNotification({
        _id,
        userNotificationId: userNotification._id,
      }),
    )
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row gutter={[4, 4]} wrap={false}>
          <Col flex="auto">
            <Typography.Title ellipsis style={{ marginBottom: 0 }} level={5}>
              {title}
            </Typography.Title>
            <Typography.Text
              ellipsis
              style={{ marginBottom: 0 }}
              type="secondary"
            >
              {content}
            </Typography.Text>
          </Col>
          <Col onClick={onReadOrUnread}>
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
      </Col>

      <Col span={12}>
        <Image
          src={thumbnail}
          alt="alt"
          style={{ borderRadius: 12 }}
          preview={false}
        />
      </Col>
      <Col span={24}>
        <Typography.Text type="secondary">
          {moment(broadcastedAt).fromNow()}
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default NotificationItem
