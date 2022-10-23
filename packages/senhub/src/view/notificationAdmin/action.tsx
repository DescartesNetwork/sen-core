import React, { useState } from 'react'

import { Button, Col, Popover, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useDeleteNotification } from 'hooks/admin/useDeleteNotification'
import NotificationModal from './notificationModal'
import { useNotifications } from 'hooks/useNotifications'

type ActionProp = {
  notificationId: string
}
const Action = ({ notificationId }: ActionProp) => {
  const { [notificationId]: notification } = useNotifications()
  const [deletingOpen, setDeletingOpen] = useState(false)
  const [updatingOpen, setUpdatingOpen] = useState(false)
  const { onDeleteNotification, loading } = useDeleteNotification()
  return (
    <Row gutter={[8, 8]} wrap={false}>
      <Col>
        <Button onClick={() => setUpdatingOpen(true)}>
          <IonIcon name="create-outline" />
        </Button>
        <NotificationModal
          open={updatingOpen}
          setOpen={setUpdatingOpen}
          data={notification}
          title={'Update Notification'}
        />
      </Col>
      <Col>
        <Popover
          content={
            <Row>
              <Col>
                <Typography.Text>
                  Are you sure to delete this notification?
                </Typography.Text>
              </Col>
              <Col>
                <Button
                  onClick={async () => {
                    await onDeleteNotification(notificationId)
                    setDeletingOpen(false)
                  }}
                  loading={loading}
                >
                  Confirm
                </Button>
              </Col>
            </Row>
          }
          trigger="click"
          open={deletingOpen}
          onOpenChange={(newOpen) => setDeletingOpen(newOpen)}
        >
          <Button>
            <IonIcon name="trash-outline" />
          </Button>
        </Popover>
      </Col>
    </Row>
  )
}

export default Action
