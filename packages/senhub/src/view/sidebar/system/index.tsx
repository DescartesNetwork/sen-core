import { useMemo } from 'react'

import { Col, Divider, Row, Tooltip } from 'antd'
import SenMarket from './market'
import Notifications from './notifications'
import AppSettings from './applications'
import Wallet from 'view/wallet'

import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { RootState, useRootSelector } from 'store'

export type SystemProps = { isMobile?: boolean }

const System = ({ isMobile = false }: SystemProps) => {
  const visible = useRootSelector(({ ui }: RootState) => ui.visibleNavigation)
  const walletAddress = useWalletAddress()

  const nextVisible = useMemo(() => !isMobile && visible, [isMobile, visible])

  return (
    <Row
      style={{ flexFlow: 'column' }}
      align={visible && !isMobile ? 'stretch' : 'middle'}
    >
      {isAddress(walletAddress) && (
        <Col>
          <AppSettings visible={nextVisible} />
        </Col>
      )}
      <Col>
        <Notifications visible={nextVisible} />
      </Col>
      <Col>
        <Divider
          style={{ margin: '8px 0px', minWidth: 48 }}
          type="horizontal"
        />
      </Col>
      <Col>
        <SenMarket isMobile={isMobile} />
      </Col>
      <Col>
        <Tooltip
          trigger={nextVisible ? [] : ['hover']}
          title="Wallet"
          arrowPointAtCenter
          placement="right"
        >
          <Wallet visible={nextVisible} style={{ margin: '8px 0px' }} />
        </Tooltip>
      </Col>
    </Row>
  )
}

export default System
