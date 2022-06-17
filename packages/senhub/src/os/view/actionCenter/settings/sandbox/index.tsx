import { Row, Col, Card, Typography, Upload } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'os/store'
import { installManifest } from 'os/store/page.reducer'

const Sandbox = () => {
  const dispatch = useRootDispatch<RootDispatch>()

  const upload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const manifest = JSON.parse(e.target?.result as string)
      try {
        await dispatch(installManifest(manifest)).unwrap()
        return window.notify({
          type: 'success',
          description: 'The DApp has been added to your workspace.',
        })
      } catch (er: any) {
        return window.notify({ type: 'warning', description: er.message })
      }
    }
    reader.readAsText(file)
    return false
  }

  return (
    <Card bodyStyle={{ padding: 16 }} hoverable bordered={false}>
      <Row gutter={[16, 16]}>
        <Col flex="auto">
          <Typography.Text>Sandbox</Typography.Text>
        </Col>
        <Col>
          <IonIcon name="flask-outline" />
        </Col>
        <Col span={24}>
          <Upload.Dragger
            accept=".json"
            beforeUpload={upload}
            maxCount={1}
            itemRender={() => null}
          >
            <Row gutter={[16, 16]}>
              <Col span="24">
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Drop the DApp's manifest here
                </Typography.Text>
              </Col>
            </Row>
          </Upload.Dragger>
        </Col>
      </Row>
    </Card>
  )
}

export default Sandbox
