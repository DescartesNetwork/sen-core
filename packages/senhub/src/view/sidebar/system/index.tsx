import { useMemo } from 'react'

import { Col, Divider, Row } from 'antd'
import SenMarket from './market'
import Notifications from './notifications'
import AppSettings from './appSettings'
import Wallet from 'view/wallet'

import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { RootState, useRootSelector } from 'store'

export type SystemProps = { isMobile?: boolean }

const System = ({ isMobile = false }: SystemProps) => {
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const walletAddress = useWalletAddress()

  const rowAlign = visible && !isMobile ? 'stretch' : 'middle'

  const nextVisible = useMemo(() => {
    if (!isMobile) return visible
    return false
  }, [isMobile, visible])

  return (
    <Row style={{ flexFlow: 'column' }} align={rowAlign}>
      {isAddress(walletAddress) && (
        <Col>
          <AppSettings visible={nextVisible} />
        </Col>
      )}
      <Col>
        <Notifications visible={nextVisible} />
      </Col>
      <Col>
        <Divider style={{ margin: '8px 0', minWidth: 48 }} type="horizontal" />
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
