import { util } from '@sentre/senhub'

import { Card, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar } from 'shared/antd/mint'
import MintSymbol from '../mintSymbol'

import './index.less'

export type MintTagProps = {
  mintAddress: string
  onClick?: (mintAddress: string) => void
  active?: boolean
}

const MintTag = ({
  mintAddress,
  onClick = () => {},
  active = false,
}: MintTagProps) => {
  return (
    <Card
      bodyStyle={{
        padding: 8,
        cursor: 'pointer',
      }}
      style={{
        borderRadius: 8,
        backgroundColor: util.randomColor(mintAddress, 0.2),
      }}
      className="mint-tag"
      bordered={Boolean(active)}
      onClick={() => onClick(mintAddress)}
    >
      <Space size={8} style={{ width: '100%', justifyContent: 'center' }}>
        <MintAvatar mintAddress={mintAddress} />
        <Typography.Text
          ellipsis={true}
          style={{ color: util.randomColor(mintAddress) }}
        >
          <MintSymbol mintAddress={mintAddress} />
        </Typography.Text>
        {active && <IonIcon name="checkmark-outline" />}
      </Space>
    </Card>
  )
}
export default MintTag
