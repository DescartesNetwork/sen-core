import { Col, Divider, Row } from 'antd'
import SenMarket from './market'
import Nofitications from './nofitications'
import AppSettings from './appSettings'
import Wallet from 'view/wallet'

import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { RootState, useRootSelector } from 'store'
import { useMemo } from 'react'

type SystemProps = { isMobile?: boolean }
const System = ({ isMobile = false }: SystemProps) => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const walletAddress = useWalletAddress()

  const rowAlign = visible && !isMobile ? 'stretch' : 'middle'

  const nextVisible = useMemo(() => {
    if (!isMobile) return visible
    return false
  }, [isMobile, visible])

  return (
    <Row gutter={[12, 12]} style={{ flexFlow: 'column' }} align={rowAlign}>
      {isAddress(walletAddress) && (
        <Col>
          <AppSettings visible={nextVisible} />
        </Col>
      )}
      <Col>
        <Nofitications visible={nextVisible} />
      </Col>
      <Col>
        <Divider style={{ margin: 0 }} type="horizontal" />
      </Col>
      <Col>
        <SenMarket isMobile={isMobile} />
      </Col>
      <Col>
        <Wallet visible={nextVisible} />
      </Col>
    </Row>
  )
}

export default System
