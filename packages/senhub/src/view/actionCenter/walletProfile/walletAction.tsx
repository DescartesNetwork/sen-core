import { Space } from 'antd'
import QR from 'components/qr'
import Clipboard from 'components/clipboard'
import NewWindow from 'components/newWindow'

import { useWalletAddress } from 'hooks/useWallet'
import { explorer } from 'shared/util'

const WalletAction = () => {
  const walletAddress = useWalletAddress()

  return (
    <Space size={4}>
      <Clipboard content={walletAddress} />
      <QR address={walletAddress} />
      <NewWindow url={explorer(walletAddress)} />
    </Space>
  )
}

export default WalletAction
