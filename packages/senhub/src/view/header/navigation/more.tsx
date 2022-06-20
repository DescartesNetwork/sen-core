import { Avatar } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useGoToStore } from 'hooks/useGotoStore'

const More = () => {
  const onGoToStore = useGoToStore()

  return (
    <span style={{ cursor: 'pointer' }} onClick={onGoToStore}>
      <Avatar shape="square">
        <IonIcon name="add-outline" />
      </Avatar>
    </span>
  )
}

export default More
