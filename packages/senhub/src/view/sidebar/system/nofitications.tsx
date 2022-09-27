import IonIcon from '@sentre/antd-ionicon'
import { MenuSystemItem } from '../index'
import MenuItem from '../components/menuItem'

type NofiticationsProps = { visible?: boolean }
const Nofitications = ({ visible }: NofiticationsProps) => {
  return (
    <MenuItem
      icon={<IonIcon name="notifications-outline" />}
      value={MenuSystemItem.Notify}
      onClick={() => {}}
      name={visible}
    >
      {MenuSystemItem.Notify}
    </MenuItem>
  )
}

export default Nofitications
