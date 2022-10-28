import { Fragment, useMemo } from 'react'

import { Row, Col, Card } from 'antd'
import AppList from './appList'
import MoreApp from './moreApp'

import { RootState, useRootSelector } from 'store'
import { useWalletAddress } from 'hooks/useWallet'
import { isAddress } from 'shared/util'

export type NavigationProps = { isMobile?: boolean }

const Navigation = ({ isMobile = false }: NavigationProps) => {
  const walletAddress = useWalletAddress()
  const visible = useRootSelector(({ ui }: RootState) => ui.visibleNavigation)

  const nextVisible = useMemo(() => !isMobile && visible, [isMobile, visible])

  if (!isAddress(walletAddress)) return <Fragment />
  return (
    <Row gutter={[16, 16]} style={{ height: '100%' }} justify="center">
      <Col
        span={visible && !isMobile ? 24 : undefined}
        style={{ maxHeight: '100%' }}
        className="scrollbar"
      >
        <AppList visible={nextVisible} />
        <Card
          bordered={false}
          style={{ boxShadow: 'unset', background: 'transparent' }}
          bodyStyle={{ padding: 8 }}
        >
          <MoreApp visible={nextVisible} />
        </Card>
      </Col>
    </Row>
  )
}

export default Navigation
