import { useMemo } from 'react'

import { Row, Col, Button, Typography, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { updateLoading } from 'store/flags.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import IconLoading from 'static/images/loadingSvg'

import './index.os.less'

const Loading = () => {
  const walletAddress = useWalletAddress()
  const loading = useRootSelector((state: RootState) => state.flags.loading)
  const dispatch = useRootDispatch<RootDispatch>()

  const visible = useMemo(
    () => isAddress(walletAddress) && loading,
    [walletAddress, loading],
  )

  return (
    <div
      className="loading-screen"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="end">
            <Col>
              <Button
                type="text"
                icon={<IonIcon name="close-outline" />}
                onClick={() => dispatch(updateLoading(false))}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{ height: 256 }} />
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Space direction="vertical" align="center" size={32}>
                <IconLoading />
                <Typography.Title level={5}>
                  Welcome to SenHub. The workspace is loading...
                </Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Loading
