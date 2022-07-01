import { useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

import { Tooltip, Space, Typography, Popover } from 'antd'
import QRCodeCanvas from 'qrcode.react'

import { useRootSelector, RootState } from 'store'
import { asyncWait, explorer, shortenAddress } from 'shared/util'
import IconButton from './iconButton'

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
      <IconButton name="qr-code-outline" />
    </Popover>
  )
}

const Address = () => {
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async (text: string) => {
    copy(text)
    setCopied(true)
    await asyncWait(1500)
    return setCopied(false)
  }, [])

  return (
    <Space size={10}>
      <Typography.Text
        style={{ color: '#E9E9EB', cursor: 'pointer' }}
        onClick={() => window.open(explorer(walletAddress), '_blank')}
      >
        {shortenAddress(walletAddress, 3, '...')}
      </Typography.Text>
      <Tooltip title="Copied" visible={copied}>
        <IconButton name="copy-outline" onClick={() => onCopy(walletAddress)} />
      </Tooltip>
      <QR address={walletAddress} />
    </Space>
  )
}

export default Address
