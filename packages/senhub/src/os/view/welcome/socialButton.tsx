import { Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const SOCIAL_MEDIA = [
  {
    src: 'https://sentre.medium.com',
    icon: 'logo-medium',
  },
  {
    src: 'https://t.me/Sentre',
    icon: 'logo-telegram',
  },
  {
    src: 'https://twitter.com/SentreProtocol',
    icon: 'logo-twitter',
  },
]

const SocialButton = () => {
  return (
    <Space className="social-button" size={24}>
      {SOCIAL_MEDIA.map((item, i) => (
        <Button
          type="text"
          size="small"
          key={i}
          onClick={() => window.open(item.src, '_blank')}
          icon={<IonIcon name={item.icon} />}
        />
      ))}
    </Space>
  )
}
export default SocialButton
