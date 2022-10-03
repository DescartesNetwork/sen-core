import { Row, Col, Card, Typography, Upload, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useRootDispatch, RootDispatch } from 'store'
import { installManifest } from 'store/register.reducer'
import { installApp } from 'store/page.reducer'
import { useWalletAddress } from 'hooks/useWallet'

const Sandbox = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useWalletAddress()

  const upload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data: ComponentManifest = JSON.parse(e.target?.result as string)
      const manifest: DAppManifest = {
        ...data,
        author: { ...data.author, walletAddress },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      try {
        await dispatch(installManifest(manifest)).unwrap()
        await dispatch(installApp(manifest.appId)).unwrap()
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
    <Card className="card-setting" hoverable bordered={false}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space size={12}>
            <IonIcon
              style={{
                color: '#56CC08',
                background: 'rgba(86, 204, 8, 0.1)',
              }}
              className="theme-icon"
              name="flask-outline"
            />
            <Typography.Text>Sandbox</Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Upload.Dragger
            accept=".json"
            beforeUpload={upload}
            maxCount={1}
            itemRender={() => null}
            className="sandbox"
          >
            <Row gutter={[16, 16]}>
              <Col span="24">
                <Typography.Text type="secondary" className="caption">
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
