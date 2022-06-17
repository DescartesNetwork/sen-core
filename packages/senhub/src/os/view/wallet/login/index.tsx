import { Modal } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import WalletConnection from './walletConnection'

import {
  useRootDispatch,
  useRootSelector,
  RootState,
  RootDispatch,
} from 'os/store'
import { closeWallet } from 'os/store/wallet.reducer'
import './index.os.less'

const Login = () => {
  const visible = useRootSelector((state: RootState) => state.wallet.visible)
  const dispatch = useRootDispatch<RootDispatch>()
  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeWallet())}
      closeIcon={<IonIcon name="close" />}
      footer={null}
      bodyStyle={{ padding: 24 }}
    >
      <WalletConnection />
    </Modal>
  )
}

export default Login
