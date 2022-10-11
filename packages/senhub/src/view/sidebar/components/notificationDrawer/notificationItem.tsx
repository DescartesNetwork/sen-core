import moment from 'moment'
import axios from 'axios'

import { Col, Row, Image, Radio, Tooltip, Typography } from 'antd'

import { DappData, upsetNotification } from 'store/notifications.reducer'
import { RootDispatch, useRootDispatch } from 'store'
import configs from 'configs'

const { api } = configs

type NotificationItemProps = {
  notification: {
    id: string
    dappId: DappData
    content: string
    name: string
    seen: boolean
    time: string
  }
}
const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { dappId, seen, content, time, id } = notification
  const dispatch = useRootDispatch<RootDispatch>()

  const onReadOrUnread = async () => {
    console.log('run function!')
    dispatch(
      upsetNotification({
        id,
        data: { ...notification, seen: !seen },
      }),
    )
    await axios.patch(api.notifications.index + `/${id}`, {
      seen: !seen,
    })
  }

  return (
    <Row wrap={false} gutter={[12, 12]} style={{ margin: '0px 24px' }}>
      <Col span={3}>
        <Image src={dappId.logo} alt="alt" />
      </Col>
      <Col flex="auto">
        <Row gutter={[4, 4]}>
          <Col span={24}>{content}</Col>
          <Col>{moment(time).fromNow()}</Col>
        </Row>
      </Col>
      <Col onClick={onReadOrUnread}>
        <Tooltip
          title={
            <Typography.Text>
              {seen ? 'Mark as unread' : 'Mark as read'}
            </Typography.Text>
          }
        >
          <Radio checked={seen} />
        </Tooltip>
      </Col>
    </Row>
  )
}

export default NotificationItem
