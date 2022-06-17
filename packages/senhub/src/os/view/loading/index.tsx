import { Row, Col, Button, Spin, Typography, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'os/store'
import './index.os.less'
import { updateLoading } from 'os/store/flags.reducer'
import { account } from '@senswap/sen-js'

const Loading = () => {
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const loading = useRootSelector((state: RootState) => state.flags.loading)
  const dispatch = useRootDispatch<RootDispatch>()

  const visible = account.isAddress(walletAddress) && loading

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
                <Spin size="large" />
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
