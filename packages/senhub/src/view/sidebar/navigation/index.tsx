import { Fragment, useMemo } from 'react'

import { Row, Col } from 'antd'
import AppList from './appList'
import More from './more'

import { useWalletAddress } from 'hooks/useWallet'
import { isAddress } from 'shared/util'
import { RootState, useRootSelector } from 'store'

type NavigationProps = { isMobile?: boolean }
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
    <Row gutter={[16, 16]} justify="center">
      <Col span={24} style={{ maxHeight: 275 }} className="scrollbar">
        <AppList visible={nextVisible} />
      </Col>
      <Col span={moreSpan}>
        <More visible={nextVisible} />
      </Col>
    </Row>
  )
}

export default Navigation
