import { useCallback, useState } from 'react'

import { Button, Col, Modal, Row, Space, Typography, Switch } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import WidgetLayout from './widgetLayout'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'store'
import { updatePage } from 'store/page.reducer'
import { useUninstallApp } from 'hooks/useUninstallApp'
import { useGoToStore } from 'hooks/useGotoStore'

const AllApplications = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const [disabled, setDisabled] = useState(true)
  const [appId, setAppId] = useState('')
  const [visible, setVisible] = useState(false)
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const register = useRootSelector((state: RootState) => state.page.register)
  const onUninstallApp = useUninstallApp(appId)
  const onGotoStore = useGoToStore()

  const onChange = useCallback(
    (appIds: AppIds) => dispatch(updatePage(appIds)),
    [dispatch],
  )
  const onClose = async () => {
    await setAppId('')
    return setVisible(false)
  }

  const onConfirm = async (appId: string) => {
    await setAppId(appId)
    return setVisible(true)
  }

  const onUninstall = useCallback(async () => {
    await onUninstallApp()
    return setVisible(false)
  }, [onUninstallApp])

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Typography.Title level={5}>All applications</Typography.Title>
      </Col>
      <Col>
        <Switch onChange={(checked) => setDisabled(!checked)} size="small" />
      </Col>
      <Col span={24}>
        <WidgetLayout
          placeholder="No installed application"
          disabled={disabled}
          appIds={appIds.filter((id) => id !== appId)}
          onChange={onChange}
          onRemove={onConfirm}
          removeLabel="Drag to uninstall"
        />
      </Col>
      {!appIds.length ? (
        <Col span={24}>
          <Button
            block
            type="primary"
            className="contained"
            icon={<IonIcon name="bag-handle-outline" />}
            onClick={onGotoStore}
          >
            Go to store
          </Button>
        </Col>
      ) : null}
      <Modal closable={false} visible={visible} footer={null} centered>
        <Row gutter={[24, 24]} justify="end">
          <Col span={24}>
            <Space align="baseline">
              <Typography.Text type="warning">
                <IonIcon name="alert-circle-outline" />
              </Typography.Text>
              <Space direction="vertical">
                <Typography.Title level={5}>
                  Do you want to uninstall {register[appId]?.name}?
                </Typography.Title>
                <Typography.Text>
                  Uninstalling this application will clear all its data.
                </Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={onUninstall}>
                Uninstall
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </Row>
  )
}

export default AllApplications
