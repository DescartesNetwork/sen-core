import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

import { Tooltip, Space, Popover } from 'antd'
import QRCodeCanvas from 'qrcode.react'
import IonIcon from '@sentre/antd-ionicon'

import { asyncWait } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

const QR = ({ address }: { address: string }) => {
  return (
    <Popover
      placement="bottomLeft"
      color="#ffffff"
      overlayInnerStyle={{ paddingTop: 6 }}
      content={
        <QRCodeCanvas
          value={address}
          size={140}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      }
      trigger="click"
      arrowPointAtCenter
    >
      <IonIcon style={{ cursor: 'pointer' }} name="qr-code-outline" />
    </Popover>
  )
}

const WalletAction = () => {
  const walletAddress = useWalletAddress()
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async (text: string) => {
    copy(text)
    setCopied(true)
    await asyncWait(1500)
    return setCopied(false)
  }, [])

  return (
    <Space size={12}>
      <Tooltip title="Copied" open={copied}>
        <IonIcon
          style={{ cursor: 'pointer' }}
          name="copy-outline"
          onClick={() => onCopy(walletAddress)}
        />
      </Tooltip>
      <QR address={walletAddress} />
    </Space>
  )
}

export default WalletAction
