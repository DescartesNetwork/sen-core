import { Space, Typography } from 'antd'
import Price, {
  PriceIndicator,
  PriceChange,
  PriceSolidus,
} from 'os/components/price'

const PriceInfo = () => {
  return (
    <Space size={6}>
      <Typography.Text>
        <PriceIndicator className="price-arrow" ticket="solana" colorized />
      </Typography.Text>
      <Typography.Text>
        <PriceChange ticket="solana" colorized />
      </Typography.Text>
      <Typography.Text>
        <PriceSolidus ticket="solana" colorized />
      </Typography.Text>
      <Typography.Text className="balance">
        <Price ticket="solana" colorized />
      </Typography.Text>
    </Space>
  )
}

export default PriceInfo
