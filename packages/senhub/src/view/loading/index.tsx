import { useMemo } from 'react'

import { Row, Col, Typography, Space } from 'antd'
import IconLoading from 'components/loadingSvg'

import { RootState, useRootSelector } from 'store'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

import './index.os.less'

const Loading = () => {
  const walletAddress = useWalletAddress()
  const loading = useRootSelector(({ flags }: RootState) => flags.loading)

  const visible = useMemo(
    () => isAddress(walletAddress) && loading,
    [walletAddress, loading],
  )

  return (
    <div
      className="loading-screen"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Row gutter={[24, 24]} justify="center">
        <Col span={24} style={{ height: 256 }} />
        <Col>
          <Space direction="vertical" align="center" size={32}>
            <IconLoading />
            <Typography.Title level={5}>
              Welcome to SenHub. The workspace is loading...
            </Typography.Title>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default Loading
