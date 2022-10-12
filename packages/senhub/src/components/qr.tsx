import { Popover, Button } from 'antd'
import { QRCodeCanvas } from 'qrcode.react'
import IonIcon from '@sentre/antd-ionicon'

export type QRProps = { address: string }

const QR = ({ address }: QRProps) => {
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
      <Button
        type="text"
        size="small"
        icon={<IonIcon name="qr-code-outline" />}
        onClick={(e) => e.stopPropagation()}
      />
    </Popover>
  )
}

export default QR
