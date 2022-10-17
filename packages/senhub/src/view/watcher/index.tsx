import { Fragment } from 'react'
import UIWatcher from './ui.watcher'
import WalletWatcher from './wallet.watcher'
import AccountWatcher from './account.watcher'
import NotificationsWatcher from './notifications.watcher'

const Watcher = () => {
  return (
    <Fragment>
      <UIWatcher />
      <WalletWatcher />
      <AccountWatcher />
      <NotificationsWatcher />
    </Fragment>
  )
}

export default Watcher
