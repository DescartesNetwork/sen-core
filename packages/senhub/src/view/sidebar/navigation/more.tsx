import { CSSProperties, useMemo } from 'react'

import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useGoToStore } from 'hooks/useGotoStore'
import { MenuSystemItem } from '../index'

export type MoreProps = {
  size?: number
  style?: CSSProperties
  visible?: boolean
}

const More = ({ size = 32, style, visible = false }: MoreProps) => {
  const onGoToStore = useGoToStore()

  const btnStyle = useMemo(
    () => ({
      minWidth: size,
      height: size,
      overflow: 'hidden',
      background: 'transparent',
    }),
    [size],
  )

  return (
    <Button
      style={{ ...btnStyle, ...style }}
      type="dashed"
      icon={<IonIcon name="add-outline" />}
      onClick={onGoToStore}
      block
    >
      {visible && MenuSystemItem.AddApp}
    </Button>
  )
}

export default More
