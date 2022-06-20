import { useMemo } from 'react'

import { Card, Col, Row } from 'antd'

import { useRootSelector, RootState } from 'store'

import storePanel1 from 'static/images/market/store-bpanel1.jpeg'
import storePanel2 from 'static/images/market/store-bpanel2.png'

const PAGE_PADDING = 20
const ELEMENT_PADDING = 24
const HEIGHT_RATIO = 1.777777
const PANELS = [
  {
    src: storePanel1,
    redirect:
      'https://sentre.medium.com/sentre-protocol-won-wormhole-silver-at-convergence-hackathon-d5f582e19906',
  },
  {
    src: storePanel2,
    redirect:
      'https://sentre.medium.com/now-live-make-defi-easy-with-sen-academy-vietnamese-below-8cf6f5b16427',
  },
]

const BottomBanner = () => {
  const width = useRootSelector((state: RootState) => state.ui.width)

  const bannerHeightRatio = useMemo(
    () => (width < 768 ? HEIGHT_RATIO : HEIGHT_RATIO * 2),
    [width],
  )
  const bannerWidth = useMemo(
    () =>
      width < 768
        ? width - PAGE_PADDING
        : width - PAGE_PADDING - ELEMENT_PADDING,
    [width],
  )

  return (
    <Row gutter={[24, 16]}>
      {PANELS.map((item, index) => {
        return (
          <Col md={12} xs={24} key={index}>
            <Card
              style={{
                height: Math.min(
                  (1920 - PAGE_PADDING - ELEMENT_PADDING) / HEIGHT_RATIO / 2,
                  bannerWidth / bannerHeightRatio,
                ),
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundImage: `url(${item.src})`,
                cursor: 'pointer',
              }}
              bordered={false}
              onClick={() => window.open(item.redirect, '_blank')}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default BottomBanner
