import { Button, Col, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AppCard from '../appCard'
import { SwiperOs } from 'components/swiperOS'
import { SwiperSlide } from 'swiper/react'

import { CategoryOptions, useAppCategory } from './hooks'
import { useGoToStore } from 'hooks/useGotoStore'

export type AppCategorySliceProps = {
  seeAll?: boolean
} & CategoryOptions

const AppCategorySlice = ({
  seeAll = true,
  ...options
}: AppCategorySliceProps) => {
  const { title, appIds } = useAppCategory(options)
  const onSeeAll = useGoToStore({
    search: `?category=${options.category}`,
  })

  // Do not display category if no application exists
  if (!appIds.length) return null
  return (
    <Row gutter={[20, 20]} align="bottom">
      {/* Title */}
      <Col flex="auto">
        <Typography.Title level={2} style={{ textTransform: 'capitalize' }}>
          {title}
        </Typography.Title>
      </Col>
      {/* See all button */}
      {seeAll && (
        <Col>
          <Typography.Text type="danger">
            <Button
              size="small"
              type="text"
              onClick={onSeeAll}
              className="btn-see-all"
            >
              See all
              <IonIcon name="chevron-forward-outline" />
            </Button>
          </Typography.Text>
        </Col>
      )}
      {/* Apps in the category */}
      <Col span={24}>
        <SwiperOs>
          {appIds.map((appId) => (
            <SwiperSlide key={appId} style={{ maxWidth: 334, width: '75vw' }}>
              <AppCard appId={appId} />
            </SwiperSlide>
          ))}
        </SwiperOs>
      </Col>
    </Row>
  )
}

export default AppCategorySlice
