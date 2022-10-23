import React, { useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Typography } from 'antd'
import NotificationModal from './notificationModal'

const NewNotification = () => {
  const [open, setOpen] = useState(false)
  return (
    <Row justify="end">
      <Col>
        <Button type="primary" onClick={() => setOpen(true)}>
          <IonIcon name="add-outline" />
          <Typography.Text>Create notification</Typography.Text>
        </Button>
      </Col>
      <NotificationModal
        open={open}
        setOpen={setOpen}
        title={'Create Notification'}
      />
    </Row>
  )
}

export default NewNotification
