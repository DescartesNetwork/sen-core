import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

export type NewWindowProps = { url: string }

const NewWindow = ({ url }: NewWindowProps) => {
  return (
    <Button
      type="text"
      size="small"
      onClick={() => window.open(url, '_blank')}
      icon={<IonIcon name="open-outline" />}
    />
  )
}

export default NewWindow
