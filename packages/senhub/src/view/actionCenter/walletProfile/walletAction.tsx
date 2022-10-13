import { Space } from 'antd'
import QR from 'components/qr'
import Clipboard from 'components/clipboard'
import NewWindow from 'components/newWindow'

import { useWalletAddress } from 'hooks/useWallet'
import { explorer } from 'shared/util'

export type WalletActionType = 'copy' | 'qr' | 'explorer'

export type WalletActionProps = {
  actions?: WalletActionType[]
}

const WalletAction = ({
  actions = ['copy', 'qr', 'explorer'],
}: WalletActionProps) => {
  const walletAddress = useWalletAddress()

  return (
    <Space size={4}>
      {actions.map((action) => {
        if (action === 'copy')
          return <Clipboard key={action} content={walletAddress} />
        if (action === 'qr') return <QR key={action} address={walletAddress} />
        if (action === 'explorer')
          return <NewWindow key={action} url={explorer(walletAddress)} />
        return null
      })}
    </Space>
  )
}

export default WalletAction
