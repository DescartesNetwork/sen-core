import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'

import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

import { setVisibleSideBar } from 'store/sidebar.reducer'

const ActionVisibleSideBar = () => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const dispatch = useRootDispatch<RootDispatch>()

  const btnName = visible ? 'chevron-back-outline' : 'chevron-forward-outline'

  return (
    <Button
      className="btn-visible-sidebar"
      icon={<IonIcon name={btnName} />}
      onClick={() => dispatch(setVisibleSideBar(!visible))}
    />
  )
}

export default ActionVisibleSideBar
