import { useHistory } from 'react-router-dom'

import { Row, Col, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Wallet from 'view/wallet'
import Brand from 'components/brand'
import ActionCenter from 'view/actionCenter'
import Navigation from './navigation'

import { useRootSelector, RootState } from 'store'
import { net } from 'shared/runtime'
import { isAddress } from 'shared/util'

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
  const history = useHistory()

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
      <Col>{!isAddress(walletAddress) ? <Wallet /> : <ActionCenter />}</Col>
    </Row>
  )
}

export default Header
