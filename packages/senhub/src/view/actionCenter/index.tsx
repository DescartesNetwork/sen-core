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
} from 'store'
import { setVisibleActionCenter } from 'store/ui.reducer'

const items = [
  {
    label: (
      <span>
        <IonIcon name="grid-outline" />
        Apps
      </span>
    ),
    key: 'applications',
    children: <Applications />,
  },
  {
    label: (
      <span>
        <IonIcon name="settings-outline" />
        Settings
      </span>
    ),
    key: 'system-settings',
    children: <Settings />,
  },
]

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
        open={visible}
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
              items={items}
              destroyInactiveTabPane
            />
          </Col>
        </Row>
      </Drawer>
    </Fragment>
  )
}

export default ActionCenter
