import { useMemo } from 'react'

import { Card, Col, Row, Typography } from 'antd'
import AppIcon from 'components/appIcon'

import { RootState, useRootSelector } from 'store'
import { useGoToStoreCallback } from 'hooks/useGotoStore'

const AllApps = () => {
  const register = useRootSelector((state: RootState) => state.page.register)
  const appIds = useMemo(() => Object.keys(register), [register])
  const onGoToStore = useGoToStoreCallback()

  return (
    <Card bordered={false} className="glass" bodyStyle={{ padding: 32 }}>
      <Row gutter={[24, 32]}>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Typography.Title type="secondary" level={3}>
                Let's explore the Store
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            {appIds.map((appId, i) => (
              <Col key={i}>
                <AppIcon
                  appId={appId}
                  size={72}
                  onClick={() => onGoToStore({ appId })}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default AllApps
