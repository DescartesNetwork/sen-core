import { Fragment, useMemo } from 'react'

import { Button, Col, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootSelector, RootState } from 'store'
import { useGoToApp } from 'hooks/useGotoApp'
import { useUninstallApp } from 'hooks/useUninstallApp'
import { useInstallApp } from 'hooks/useInstallApp'

export type InstalledAppProps = {
  installed: boolean
  appId: string
}

const InstalledApp = ({ installed, appId }: InstalledAppProps) => {
  const infix = useRootSelector((state: RootState) => state.ui.infix)
  const opOpen = useGoToApp({ appId })
  const onInstall = useInstallApp(appId)
  const onUninstall = useUninstallApp(appId)

  const isMobile = useMemo(() => infix === 'xs' || infix === 'sm', [infix])
  const justify = useMemo(() => (isMobile ? 'start' : 'end'), [isMobile])

  return (
    <Row gutter={[12, 12]} justify={justify}>
      {installed ? (
        <Fragment>
          <Col span={isMobile ? 12 : undefined}>
            <Button
              icon={<IonIcon name="trash-outline" />}
              onClick={onUninstall}
              block={isMobile}
            >
              Uninstall
            </Button>
          </Col>

          <Col span={isMobile ? 12 : undefined}>
            <Button
              type="primary"
              icon={<IonIcon name="open-outline" />}
              onClick={opOpen}
              block={isMobile}
            >
              Open
            </Button>
          </Col>
        </Fragment>
      ) : (
        <Col span={isMobile ? 24 : undefined}>
          <Button
            type="primary"
            icon={<IonIcon name="cloud-download-outline" />}
            onClick={onInstall}
            block={isMobile}
          >
            Install
          </Button>
        </Col>
      )}
    </Row>
  )
}

export default InstalledApp
