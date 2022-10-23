import type { ColumnsType } from 'antd/es/table'
import moment from 'moment'

import { Table, Image, Typography, Tag } from 'antd'
import Action from './action'

export interface DataType {
  key: React.Key
  time: string
  image: string
  title: string
  description: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'TIME',
    dataIndex: 'time',
    render: (time: string) => {
      return moment(time).format('MMMM Do YYYY, h:mm')
    },
  },
  {
    title: 'IMAGE',
    dataIndex: 'image',
    render: (image) => {
      return <Image src={image} alt="Notification" />
    },
  },
  {
    title: 'TITLE',
    dataIndex: 'title',
    render: (title) => {
      return (
        <Typography.Title ellipsis level={5}>
          {title}
        </Typography.Title>
      )
    },
    ellipsis: true,
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    render: (description) => {
      return (
        <Typography.Text type="secondary" ellipsis>
          {description}
        </Typography.Text>
      )
    },
    ellipsis: true,
  },
  {
    title: 'STATUS',
    dataIndex: 'time',
    render: (time) => {
      const status =
        new Date(time).getTime() > Date.now() ? (
          <Tag color="gold">Pending</Tag>
        ) : (
          <Tag color="green">Sent</Tag>
        )
      return status
    },
  },
  {
    title: 'ACTION',
    dataIndex: 'key',
    render: (key: string) => <Action notificationId={key} />,
  },
]

type NotificationTableProps = {
  data: DataType[]
}

const NotificationTable = ({ data }: NotificationTableProps) => {
  return <Table columns={columns} dataSource={data} />
}

export default NotificationTable
