import { Tooltip } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

export type VerificationProps = {
  verified?: boolean
  title?: string
  size?: number
  color?: string
  backgroundColor?: string
}

const Verification = ({
  verified,
  title = 'Verified by Sentre',
  size = 16,
  color = '#18A0FB',
  backgroundColor = '#fafafa',
}: VerificationProps) => {
  return verified ? (
    <Tooltip title={title}>
      <IonIcon
        name="checkmark-circle"
        style={{
          color,
          backgroundColor,
          borderRadius: 8,
          fontSize: size,
        }}
      />
    </Tooltip>
  ) : null
}

export default Verification
