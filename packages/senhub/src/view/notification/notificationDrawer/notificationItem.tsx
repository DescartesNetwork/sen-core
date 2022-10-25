import moment from 'moment'
import { MouseEvent, useCallback, useMemo } from 'react'

import { Col, Row, Image, Radio, Tooltip, Typography } from 'antd'

import { RootDispatch, useRootDispatch } from 'store'
import { NotificationData } from 'store/notifications/notifications.reducer'
import { useUserNotification } from 'hooks/useUserNotification'
import { useNotifications } from 'hooks/useNotifications'
import { updateReadNotification } from 'store/notifications/userNotification.reducer'
import { useWalletAddress } from 'hooks/useWallet'
import { isGuestAddress } from 'shared/util'

import NormalLogo from 'static/images/notification/normal-notification.png'
import QuestLogo from 'static/images/notification/quest.png'

export type NotificationItemProps = {
  notification: NotificationData
}

const NotificationItem = ({
  notification: { _id, content, broadcastedAt, title, type, action },
}: NotificationItemProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()
  const { notificationMark, readIds } = useUserNotification()
  const notifications = useNotifications()

  const guest = useMemo(() => isGuestAddress(walletAddress), [walletAddress])
  const logo = useMemo(() => {
    return type === 'sentre' ? NormalLogo : QuestLogo
  }, [type])

  const seen = useMemo(() => {
    if (!notificationMark) return false
    const notificationMarkIndex = notifications.findIndex(
      ({ _id }) => _id === notificationMark,
    )
    const notificationIndex = notifications.findIndex(
      ({ _id: id }) => id === _id,
    )
    if (notificationIndex >= notificationMarkIndex) return true
    if (readIds.includes(_id)) return true
    return false
  }, [_id, notifications, notificationMark, readIds])

  const onRead = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (seen || guest) return
      return await dispatch(updateReadNotification({ _id }))
    },
    [_id, dispatch, guest, seen],
  )

  const onAction = useCallback(async () => {
    if (guest) return
    if (!seen) dispatch(updateReadNotification({ _id }))
    return window.open(action, 'blank')
  }, [_id, action, dispatch, guest, seen])

  return (
    <Row
      gutter={[12, 12]}
      style={{ cursor: 'pointer' }}
      wrap={false}
      onClick={onAction}
    >
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
