import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useGoToStore } from 'hooks/useGotoStore'

export type MoreProps = {
  size?: number
  visible?: boolean
}

const MoreApp = ({ size = 32, visible = false }: MoreProps) => {
  const onGoToStore = useGoToStore()

  return (
    <Button
      style={{
        minWidth: size,
        height: size,
        overflow: 'hidden',
        background: 'transparent',
      }}
      type="dashed"
      icon={<IonIcon name="add-outline" />}
      onClick={onGoToStore}
      block
    >
      {visible && 'More App'}
    </Button>
  )
}

export default MoreApp
