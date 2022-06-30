import { CSSProperties, useEffect, useRef, useState } from 'react'

import { Card, Col, Row } from 'antd'
import AppCardInfo from './appCardInfo'

import { MultiStaticLoader } from 'components/staticLoader'
import imgError from 'static/images/error-image.svg'
import { useGoToStore } from 'hooks/useGotoStore'

export type AppCardProps = {
  appId: string
  style?: CSSProperties
}

const AppCard = ({ appId, style = {} }: AppCardProps) => {
  const [cardHeight, setCardHeight] = useState(0)
  const ref = useRef(null)
  const onOpen = useGoToStore({ appId })

  useEffect(() => {
    setCardHeight((ref?.current as any)?.offsetWidth * 0.75)
  }, [ref])

  return (
    <Row ref={ref}>
      <Col span={24}>
        <MultiStaticLoader
          defaultData={[imgError]}
          appId={appId}
          type="panels"
          render={(data) => (
            <Card
              style={{
                backgroundImage: `url(${data[0] || imgError})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: 'none',
                ...style,
              }}
              bodyStyle={{ padding: 0 }}
              key={appId}
              onClick={onOpen}
            >
              <Row align="bottom" style={{ height: cardHeight }}>
                <Col span={24}>
                  <AppCardInfo appId={appId} />
                </Col>
              </Row>
            </Card>
          )}
        />
      </Col>
    </Row>
  )
}

export default AppCard
