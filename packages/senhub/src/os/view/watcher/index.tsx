import { Fragment } from 'react'
import UIWatcher from './ui.watcher'
import WalletWatcher from './wallet.watcher'
import AccountWatcher from './account.watcher'
import PoolWatcher from './pool.watcher'

const Watcher = () => {
  return (
    <Fragment>
      <UIWatcher />
      <WalletWatcher />
      <AccountWatcher />
      <PoolWatcher />
    </Fragment>
  )
}

export default Watcher
