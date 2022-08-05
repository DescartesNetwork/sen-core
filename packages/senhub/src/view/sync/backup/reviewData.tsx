import { useEffect, useState } from 'react'

import { Col, Row, Typography } from 'antd'
import JsonViewer from 'components/jsonViewer'

import PDB from 'shared/pdb'
import { useWalletAddress } from 'hooks/useWallet'

const ReviewData = () => {
  const [data, setData] = useState({})
  const walletAddress = useWalletAddress()

  useEffect(() => {
    const pdb = new PDB(walletAddress)
    pdb.all().then((data) => setData(data))
  }, [walletAddress])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text type="secondary">Data</Typography.Text>
      </Col>
      <Col span={24}>
        <JsonViewer value={data} />
      </Col>
    </Row>
  )
}

export default ReviewData
