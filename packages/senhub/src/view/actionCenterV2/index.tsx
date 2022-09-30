import { Fragment, useCallback } from 'react'

import { Button, Card, Col, Drawer, Row, Typography } from 'antd'
import WalletProfile from './components/walletProfile'
import IonIcon from '@sentre/antd-ionicon'
import WalletInfo from './walletInfo'
import Settings from './settings'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { setVisibleActionCenter } from 'store/ui.reducer'

import './index.os.less'

type ActionCenterV2Props = {
  visibleNavigation: boolean
}

const ActionCenterV2 = ({ visibleNavigation }: ActionCenterV2Props) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleActionCenter,
  )

  const onActionCenter = useCallback(async () => {
    return dispatch(setVisibleActionCenter(true))
  }, [dispatch])

  return (
    <Fragment>
      <WalletProfile
        padding={8}
        visible={visibleNavigation}
        onOpenActionCenter={onActionCenter}
      />

      <Drawer
        open={visible}
        onClose={() => dispatch(setVisibleActionCenter(false))}
        closable={false}
        contentWrapperStyle={{ width: '95%', maxWidth: 352 }}
        destroyOnClose
        placement="left"
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="center-header" bordered={false}>
              <Row align="middle" gutter={[24, 24]}>
                <Col flex="auto">
                  <Typography.Title style={{ color: '#F4F4F5' }} level={4}>
                    Account
                  </Typography.Title>
                </Col>
                <Col>
                  <Button
                    type="text"
                    size="large"
                    icon={<IonIcon name="close" />}
                    style={{ color: '#F4F4F5' }}
                    onClick={() => dispatch(setVisibleActionCenter(false))}
                  />
                </Col>
                <Col span={24}>
                  <WalletInfo />
                </Col>
                <Col span={24}>
                  <Settings />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Drawer>
    </Fragment>
  )
}
export default ActionCenterV2
