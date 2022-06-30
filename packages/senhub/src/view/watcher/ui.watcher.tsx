import { Fragment, useEffect } from 'react'

import { notification, message } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'store'
import { resize } from 'store/ui.reducer'

const UIWatcher = () => {
  const [notificationAPI, notificationContextHolder] =
    notification.useNotification()
  const [mesageAPI, mesageContextHolder] = message.useMessage()
  const dispatch = useRootDispatch<RootDispatch>()

  // Notification system
  window.notify = ({
    type,
    description,
    onClick = () => {},
  }: SentreNotification) => {
    return notificationAPI[type]({
      message: type.toUpperCase(),
      description,
      onClick,
      style: { cursor: 'pointer' },
      closeIcon: <IonIcon name="close-outline" />,
    })
  }
  // Message system
  window.message = ({ type, description }: SentreMessage) => {
    return mesageAPI[type](description)
  }

  // Listen window events
  useEffect(() => {
    window.onresize = () => dispatch(resize())
  }, [dispatch])

  return (
    <Fragment>
      <Fragment key="nofitication-context-holder">
        {notificationContextHolder}
      </Fragment>
      <Fragment key="message-context-holder">{mesageContextHolder}</Fragment>
    </Fragment>
  )
}

export default UIWatcher
