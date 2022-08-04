import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { Row, Col, Card } from 'antd'
import WelcomeSlide from './welcomeSlide'
import SocialButton from './socialButton'
import WalletConnection from 'view/wallet/login/walletConnection'

import { useRootSelector, RootState } from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import { useAppIds } from 'hooks/useAppIds'
import { isAddress } from 'shared/util'

import './index.os.less'

const Welcome = () => {
  const history = useHistory()
  const { search } = useLocation()
  const walletAddress = useWalletAddress()
  const appIds = useAppIds()
  const width = useRootSelector((state: RootState) => state.ui.width)
  const loading = useRootSelector((state: RootState) => state.flags.loading)

  // Redirect callback
  useEffect(() => {
    const params = new URLSearchParams(search)
    const fallback = appIds.length ? `/app/${appIds[0]}` : '/store'
    const redirect = decodeURIComponent(params.get('redirect') || fallback)
    if (isAddress(walletAddress) && !loading) history.replace(redirect)
  }, [walletAddress, history, search, appIds, loading])

  return (
    <Row gutter={[24, 24]} justify="center" className="welcome">
      <Col xs={24} lg={12} className="welcome-slide">
        <WelcomeSlide />
        <SocialButton />
      </Col>
      {width >= 992 && (
        <Col xs={24} lg={12} className="welcome-wallet-connection">
          <Card
            className="card-wallet-connection"
            bordered={false}
            hoverable={false}
          >
            <WalletConnection />
          </Card>
        </Col>
      )}
    </Row>
  )
}

export default Welcome
