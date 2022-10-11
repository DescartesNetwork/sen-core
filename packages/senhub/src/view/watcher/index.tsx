import { Fragment } from 'react'
import UIWatcher from './ui.watcher'
import WalletWatcher from './wallet.watcher'
import AccountWatcher from './account.watcher'

const Watcher = () => {
  return (
    <Fragment>
      <UIWatcher />
      <WalletWatcher />
      <AccountWatcher />
    </Fragment>
  )
}

export default Watcher
