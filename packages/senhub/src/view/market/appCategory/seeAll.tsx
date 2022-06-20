import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AppCard from '../appCard'

import { CategoryOptions, useAppCategory } from './hooks'
import { useGoToStore } from 'hooks/useGotoStore'

const CategorySeeAll = (options: CategoryOptions) => {
  const { title, appIds } = useAppCategory(options)
  const onGoToStore = useGoToStore()

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space>
          <Button
            type="text"
            icon={<IonIcon name="arrow-back-outline" />}
            onClick={onGoToStore}
          />
          <Typography.Title level={2} style={{ textTransform: 'capitalize' }}>
            {title}
          </Typography.Title>
        </Space>
      </Col>
      {appIds.map((appId) => (
        <Col xs={24} sm={12} md={8} xl={6} key={appId}>
          <AppCard appId={appId} />
        </Col>
      ))}
    </Row>
  )
}

export default CategorySeeAll
