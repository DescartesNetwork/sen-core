import React from 'react'

import { Modal, Typography } from 'antd'
import NotificationForm from './notificationForm'

import { NotificationData } from 'store/notifications/notifications.reducer'

type NotificationModalProps = {
  open: boolean
  setOpen: (val: boolean) => void
  data?: NotificationData
  title: string
}
const NotificationModal = ({
  open,
  setOpen,
  data,
  title,
}: NotificationModalProps) => {
  return (
    <Modal
      open={open}
      closable
      title={<Typography.Title level={4}>{title}</Typography.Title>}
      onCancel={() => setOpen(false)}
      destroyOnClose
      footer={null}
    >
      <NotificationForm onCancel={() => setOpen(false)} data={data} />
    </Modal>
  )
}

export default NotificationModal
