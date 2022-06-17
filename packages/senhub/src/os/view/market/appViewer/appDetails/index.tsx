import { useMemo } from 'react'
import { account } from '@senswap/sen-js'

import { Row, Col, Typography, Space } from 'antd'
import AppIcon from 'os/components/appIcon'
import Verification from 'os/components/verification'
import InstalledApp from './installedApp'
import AppTags from './appTags'
import AppAuthor from './appAuthor'
import AppReadMe from './appReadMe'
import AppShare from './appShare'

import { useRootSelector, RootState } from 'os/store'

const AppDetails = ({ appId }: { appId: string }) => {
  const infix = useRootSelector((state: RootState) => state.ui.infix)
  const register = useRootSelector((state: RootState) => state.page.register)
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )

  const { description, author, name, tags, verified } = useMemo(
    () => register[appId] || ({} as ComponentManifest),
    [register, appId],
  )
  const isMobile = useMemo(() => infix === 'xs' || infix === 'sm', [infix])
  const floatSocialButton = useMemo(
    () => (isMobile ? 'start' : 'end'),
    [isMobile],
  )
  const installed = useMemo(
    () => account.isAddress(walletAddress) && appIds.includes(appId),
    [walletAddress, appIds, appId],
  )

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={isMobile ? 24 : 14}>
            <Row gutter={[32, 24]} wrap={false}>
              <Col>
                <AppIcon appId={appId} size={96} name={false} />
              </Col>
              <Col flex="auto">
                <Space direction="vertical" size={16}>
                  <Space align="center">
                    <Typography.Title level={2}>{name}</Typography.Title>
                    <Verification verified={verified} />
                  </Space>
                  <AppTags tags={tags} />
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={isMobile ? 24 : 10}>
            <Row gutter={[16, 16]} justify={floatSocialButton}>
              <Col span={24}>
                <InstalledApp appId={appId} installed={installed} />
              </Col>
              <Col>
                <Space>
                  <AppShare appId={appId} />
                  <AppReadMe appId={appId} />
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <AppAuthor author={author} />
      </Col>
      <Col span={24}>
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: 'More' }}
        >
          {description}
        </Typography.Paragraph>
      </Col>
    </Row>
  )
}

export default AppDetails
