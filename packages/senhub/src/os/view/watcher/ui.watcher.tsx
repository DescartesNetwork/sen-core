import { Fragment, useEffect } from 'react'

import { notification } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'os/store'
import { resize } from 'os/store/ui.reducer'

const UIWatcher = () => {
  const [api, contextHolder] = notification.useNotification()
  const dispatch = useRootDispatch<RootDispatch>()

  // Notification system
  window.notify = ({
    type,
    description,
    onClick = () => {},
  }: SentreNotification) => {
    return api[type]({
      message: type.toUpperCase(),
      description,
      onClick,
      style: { cursor: 'pointer' },
      closeIcon: <IonIcon name="close-outline" />,
    })
  }

  // Listen window events
  useEffect(() => {
    window.onresize = () => dispatch(resize())
  }, [dispatch])

  return <Fragment>{contextHolder}</Fragment>
}

export default UIWatcher
