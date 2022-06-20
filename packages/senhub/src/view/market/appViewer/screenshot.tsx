import { useCallback } from 'react'

import { Col, Image, Row } from 'antd'
import { SwiperSlide } from 'swiper/react'
import { SwiperOs } from 'components/swiperOS'

import { useRootSelector, RootState } from 'store'
import { MultiStaticLoader } from 'components/staticLoader'

import imgError from 'static/images/error-image.svg'

const PADDING_CARD = 24
const PADDING_PAGE = 39 // padding 24 + width scroll bar 15

const ScreenShot = ({ appId }: { appId: string }) => {
  const width = useRootSelector((state: RootState) => state.ui.width)

  const calculatePerCard = useCallback(() => {
    if (width < 768) return 1
    return 2
  }, [width])
  const calculateHeightImage = useCallback(() => {
    if (width > 991)
      return (
        (3 *
          (((width - PADDING_PAGE - PADDING_CARD) / 2 - PADDING_CARD) / 2 -
            12)) /
        4
      )
    if (width <= 767)
      return (3 * (width - PADDING_PAGE - PADDING_CARD - PADDING_CARD)) / 4
    return (3 * ((width - PADDING_PAGE - PADDING_CARD) / 2 - PADDING_CARD)) / 4
  }, [width])

  return (
    <Row gutter={[24, 24]} justify="center" className="app-detail-carousel">
      <Col span={24}>
        <MultiStaticLoader
          appId={appId}
          type="panels"
          defaultData={[imgError]}
          render={(data) => {
            return (
              <SwiperOs slidesPerView={calculatePerCard()}>
                {data.map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <Image
                      style={{ height: calculateHeightImage() }}
                      src={src}
                    />
                  </SwiperSlide>
                ))}
              </SwiperOs>
            )
          }}
        />
      </Col>
    </Row>
  )
}

export default ScreenShot
