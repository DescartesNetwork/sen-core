import { useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { Row, Col, Card, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AppDetails from './appDetails'
import ScreenShot from './screenshot'
import AppCategorySlice from '../appCategory/slice'

import { CustomCategory } from '../appCategory/hooks'
import './index.os.less'

const AppViewer = () => {
  const history = useHistory()
  const { appId } = useParams<{ appId: string }>()

  const onBack = useCallback(() => history.goBack(), [history])

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col span={24} className="sentre-col-container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Button
              type="text"
              size="small"
              icon={<IonIcon name="arrow-back-outline" />}
              onClick={onBack}
              style={{ marginLeft: -7 }}
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <Card bordered={false}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <AppDetails appId={appId} />
                </Col>
                <Col xs={24} lg={12}>
                  <ScreenShot appId={appId} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <AppCategorySlice
              category={CustomCategory.suggest}
              related={{ appIds: [appId] }}
              seeAll={false}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AppViewer
