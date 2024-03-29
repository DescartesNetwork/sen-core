import { Fragment, useCallback } from 'react'

import { Button, Card, Col, Drawer, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import WalletProfile from './walletProfile'
import WalletInfo from './walletInfo'
import Settings from './settings'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { setVisibleActionCenter } from 'store/ui.reducer'
import { openWallet } from 'store/wallet.reducer'
import { useWalletAddress } from 'hooks/useWallet'
import { isGuestAddress } from 'shared/util'

import './index.os.less'

type ActionCenterProps = {
  visibleNavigation: boolean
}

const ActionCenter = ({ visibleNavigation }: ActionCenterProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const visibleActionCenter = useRootSelector(
    ({ ui }: RootState) => ui.visibleActionCenter,
  )
  const sidebarPosition = useRootSelector(
    ({ ui }: RootState) => ui.sidebarPosition,
  )
  const walletAddress = useWalletAddress()

  const onWalletProfile = useCallback(async () => {
    if (isGuestAddress(walletAddress)) return dispatch(openWallet())
    return dispatch(setVisibleActionCenter(true))
  }, [walletAddress, dispatch])

  return (
    <Fragment>
      <WalletProfile
        padding={8}
        visible={visibleNavigation}
        onClick={onWalletProfile}
      />
      <Drawer
        open={visibleActionCenter}
        onClose={() => dispatch(setVisibleActionCenter(false))}
        closable={false}
        contentWrapperStyle={{ width: 378 }}
        destroyOnClose
        placement={sidebarPosition}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="action-center" bordered={false}>
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
export default ActionCenter
