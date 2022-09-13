import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { Col, Modal, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import CustomAppIcon from './customAppIcon'

import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'
import { setVisibleInstaller } from 'store/ui.reducer'
import { randChoose } from 'shared/util'
import { useInstallAppCallback } from 'hooks/useInstallApp'
import { useRegister } from 'hooks/useRegister'
import { useAppIds } from 'hooks/useAppIds'
import SearchEngine from './searchEngine'

const SUGGESTION_LIMIT = 6

const Installer = () => {
  const [recommendedApps, setRecommendeddApps] = useState<string[]>([])
  const appIds = useAppIds()
  const register = useRegister()
  const value = useRootSelector((state: RootState) => state.search.value)
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleInstaller,
  )
  const dispatch = useRootDispatch<RootDispatch>()
  const history = useHistory()
  const { pathname, search } = useLocation()
  const onInstall = useInstallAppCallback()

  const params = new URLSearchParams(search)
  const autoInstall = params.get('autoInstall') === 'true' ? true : false

  const allAppIds = useMemo(() => Object.keys(register), [register])
  const exactAppId = useMemo(() => {
    return allAppIds.find((id) => id === value)
  }, [allAppIds, value])
  const installed = useMemo(
    () => Boolean(exactAppId && appIds.includes(exactAppId)),
    [appIds, exactAppId],
  )

  const closeInstaller = useCallback(async () => {
    await dispatch(setVisibleInstaller(false))
    return history.push('/welcome')
  }, [dispatch, history])

  const onSearch = useCallback(async () => {
    if (!visible) return setRecommendeddApps([]) // For performance
    const engine = new SearchEngine(register)
    const appIds = engine.search(value)
    // Suggest additional apps
    while (appIds.length < Math.min(allAppIds.length, SUGGESTION_LIMIT)) {
      const randAppId = randChoose(allAppIds)
      if (!appIds.includes(randAppId)) appIds.push(randAppId)
    }
    return setRecommendeddApps(appIds)
  }, [allAppIds, register, value, visible])

  useEffect(() => {
    onSearch()
  }, [onSearch])

  useEffect(() => {
    if (autoInstall && exactAppId && !installed) onInstall(exactAppId)
  }, [onInstall, autoInstall, exactAppId, installed])

  if (autoInstall || !pathname.startsWith('/app')) return <Fragment />
  return (
    <Modal
      title={null}
      closeIcon={<IonIcon name="close-outline" />}
      footer={null}
      onCancel={closeInstaller}
      open={visible}
      destroyOnClose
    >
      <Row gutter={[18, 18]}>
        {exactAppId ? (
          <Fragment>
            <Col span={24}>
              <Typography.Title level={4}>
                You need to install this app
              </Typography.Title>
            </Col>
            <Col span={24}>
              <CustomAppIcon appId={exactAppId} />
            </Col>
          </Fragment>
        ) : (
          <Fragment>
            <Col span={24}>
              <Typography.Title level={4}>Opps!</Typography.Title>
            </Col>
            <Col span={24}>
              <Space>
                <IonIcon name="warning-outline" />
                <Typography.Text type="secondary">
                  Cannot find the DApp. Please make sure you have a correct
                  link!
                </Typography.Text>
              </Space>
            </Col>
          </Fragment>
        )}
        <Col span={24} />
        <Col span={24}>
          <Typography.Title level={4}>Recommended Apps</Typography.Title>
        </Col>
        {recommendedApps.map((appId, i) => (
          <Col span={12} key={i}>
            <CustomAppIcon appId={appId} />
          </Col>
        ))}
      </Row>
    </Modal>
  )
}

export default Installer
