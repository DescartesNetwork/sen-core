import { Fragment } from 'react'

import { Row, Col } from 'antd'
import AppList from './appList'
import More from './more'

import { useWalletAddress } from 'hooks/useWallet'
import { isAddress } from 'shared/util'
import { RootState, useRootSelector } from 'store'

const Navigation = () => {
  const walletAddress = useWalletAddress()
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const moreSpan = visible ? 24 : undefined
  if (!isAddress(walletAddress)) return <Fragment />

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col span={24} style={{ maxHeight: 275 }} className="scrollbar">
        <AppList visible={visible} />
      </Col>
      <Col span={moreSpan}>
        <More visible={visible} />
      </Col>
    </Row>
  )
}

export default Navigation
