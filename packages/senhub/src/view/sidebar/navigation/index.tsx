import { Fragment, useMemo } from 'react'

import { Row, Col, Card } from 'antd'
import AppList from './appList'
import More from './more'

import { useWalletAddress } from 'hooks/useWallet'
import { isAddress } from 'shared/util'
import { RootState, useRootSelector } from 'store'

export type NavigationProps = { isMobile?: boolean }

const Navigation = ({ isMobile = false }: NavigationProps) => {
  const walletAddress = useWalletAddress()
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const moreSpan = visible && !isMobile ? 24 : undefined

  const nextVisible = useMemo(() => {
    if (!isMobile) return visible
    return false
  }, [isMobile, visible])

  if (!isAddress(walletAddress)) return <Fragment />
  return (
    <Row gutter={[16, 16]} style={{ height: '100%' }} justify="center">
      <Col span={moreSpan} style={{ maxHeight: '100%' }} className="scrollbar">
        <AppList visible={nextVisible} />
        <Card
          bordered={false}
          style={{ boxShadow: 'unset', background: 'transparent' }}
          bodyStyle={{ padding: 8 }}
        >
          <More visible={nextVisible} />
        </Card>
      </Col>
    </Row>
  )
}

export default Navigation
