import IonIcon from '@sentre/antd-ionicon'

const IconButton = ({
  name,
  color = '#BEC4EC',
  onClick = () => {},
}: {
  name: string
  color?: string
  onClick?: () => void
}) => {
  return (
    <span onClick={onClick} style={{ cursor: 'pointer', color }}>
      <IonIcon name={name} />
    </span>
  )
}

export default IconButton
