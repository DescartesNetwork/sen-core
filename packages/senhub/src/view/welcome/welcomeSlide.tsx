import { Card, Carousel, Col, Image, Row, Space, Typography } from 'antd'

import { DataSlide } from './dataSlide'

const WelcomeSlide = () => {
  return (
    <Card className="slide-container" bordered={false}>
      <Carousel autoplay>
        {DataSlide.map(({ title, logo, content }, i) => (
          <span key={i}>
            <Row gutter={[24, 24]} justify="center">
              <Col>
                <Space direction="vertical" size={24} align="center">
                  <Image src={logo} preview={false} />
                  <Typography.Title level={1}>{title}</Typography.Title>
                </Space>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                {content}
              </Col>
            </Row>
          </span>
        ))}
      </Carousel>
    </Card>
  )
}

export default WelcomeSlide
