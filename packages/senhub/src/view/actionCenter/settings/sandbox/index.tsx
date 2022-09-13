import { Row, Col, Card, Typography, Upload } from 'antd'
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
