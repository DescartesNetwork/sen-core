import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Wallet from 'view/wallet'
import Brand from 'components/brand'
import ActionCenter from 'view/actionCenter'
import Navigation from './navigation'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { setWalkthrough, WalkThroughType } from 'store/walkthrough.reducer'
import { net } from 'shared/runtime'
import { useGoToStore } from 'hooks/useGotoStore'

export type NavButtonProps = {
  id: string
  iconName: string
  title: string
  onClick: () => void
}

export const NavButton = ({ id, iconName, title, onClick }: NavButtonProps) => {
  const width = useRootSelector((state: RootState) => state.ui.width)
  return (
    <Button
      type="text"
      icon={<IonIcon name={iconName} />}
      onClick={onClick}
      id={id}
    >
      {width >= 576 ? title : null}
    </Button>
  )
}

const Header = () => {
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const width = useRootSelector((state: RootState) => state.ui.width)
  const theme = useRootSelector((state: RootState) => state.ui.theme)
  const run = useRootSelector((state: RootState) => state.walkthrough.run)
  const step = useRootSelector((state: RootState) => state.walkthrough.step)
  const dispatch = useRootDispatch<RootDispatch>()
  const history = useHistory()

  const onGoToStore = useGoToStore()
  const onStore = useCallback(async () => {
    if (run && step === 0)
      await dispatch(
        setWalkthrough({ type: WalkThroughType.NewComer, step: 1 }),
      )
    return onGoToStore()
  }, [dispatch, run, step, onGoToStore])

  return (
    <Row gutter={[12, 12]} align="middle" wrap={false}>
      <Col>
        <Brand
          style={{ height: 24, cursor: 'pointer' }}
          direction={width < 768 ? 'vertical' : 'horizontal'}
          theme={theme}
          network={net}
          onClick={() => history.push('/')}
        />
      </Col>
      <Col flex="auto">
        <Navigation />
      </Col>
      <Col>
        <Space align="center">
          <NavButton
            id="store-nav-button"
            iconName="bag-handle-outline"
            onClick={onStore}
            title="Store"
          />
          {!account.isAddress(walletAddress) ? <Wallet /> : <ActionCenter />}
        </Space>
      </Col>
    </Row>
  )
}

export default Header
