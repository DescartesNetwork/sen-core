import { Fragment, useCallback } from 'react'

import { Row, Col, Drawer, Button, Tabs } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Applications from './applications'
import Settings from './settings'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'os/store'
import { setVisibleActionCenter } from 'os/store/ui.reducer'

const ActionCenter = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleActionCenter,
  )

  const onActionCenter = useCallback(async () => {
    return dispatch(setVisibleActionCenter(true))
  }, [dispatch])

  return (
    <Fragment>
      <Button
        type="text"
        icon={<IonIcon name="menu" style={{ fontSize: 20 }} />}
        onClick={onActionCenter}
        id="button-action-center"
      />
      <Drawer
        visible={visible}
        onClose={() => dispatch(setVisibleActionCenter(false))}
        closable={false}
        contentWrapperStyle={{ width: '95%', maxWidth: 400 }}
        destroyOnClose
      >
        <Row gutter={[16, 16]} style={{ marginTop: -16 }}>
          <Col span={24}>
            <Tabs
              style={{ overflow: 'visible' }}
              tabBarExtraContent={
                <Button
                  type="text"
                  icon={<IonIcon name="close" />}
                  onClick={() => dispatch(setVisibleActionCenter(false))}
                />
              }
              destroyInactiveTabPane
            >
              <Tabs.TabPane
                tab={
                  <span>
                    <IonIcon name="grid-outline" />
                    Apps
                  </span>
                }
                key="applications"
              >
                <Applications />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <IonIcon name="settings-outline" />
                    Settings
                  </span>
                }
                key="system-settings"
              >
                <Settings />
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Drawer>
    </Fragment>
  )
}

export default ActionCenter
