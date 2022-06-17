import { TooltipRenderProps } from 'react-joyride'

import { Row, Col, Card, Button } from 'antd'

import { useRootDispatch, RootDispatch } from 'os/store'
import { updateVisited } from 'os/store/flags.reducer'

const Tooltip = ({
  index,
  step,
  tooltipProps,
  skipProps,
  size,
}: TooltipRenderProps) => {
  const dispatch = useRootDispatch<RootDispatch>()
  // Patch skipProps
  const { onClick, ...rest } = skipProps
  skipProps = {
    onClick: async (e) => {
      await dispatch(updateVisited(true))
      return onClick(e)
    },
    ...rest,
  }

  return (
    <div {...tooltipProps} style={{ maxWidth: 360 }}>
      <Card bordered={false}>
        <Row gutter={[24, 24]}>
          <Col span={24}>{step.title}</Col>
          <Col span={24}>{step.content}</Col>
          <Col span={24}>
            <Row gutter={[8, 8]} align="middle" wrap={false}>
              <Col flex="auto">
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                  {Array.from({ length: size }, (_, i) => i + 1).map((item) => (
                    <div
                      key={item}
                      style={{
                        width: item === index + 1 ? 20 : 12,
                        height: 4,
                        background: item === index + 1 ? '#F9575E' : '#FEDDDF',
                        margin: '0px 4px',
                        borderRadius: 8,
                      }}
                    />
                  ))}
                </div>
              </Col>
              <Col>
                <Button {...skipProps} type="text" id="skip">
                  Skip
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default Tooltip
