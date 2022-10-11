import IonIcon from '@sentre/antd-ionicon'
import MenuItem from '../components/menuItem'
import { MenuSystemItem } from '../constants'

export type NotificationsProps = { visible?: boolean }

const Notifications = ({ visible }: NotificationsProps) => {
  return (
    <MenuItem
      icon={<IonIcon name="notifications-outline" />}
      value={MenuSystemItem.Notify}
      onClick={() => {}}
      name={visible}
      disabled
    >
      {MenuSystemItem.Notify}
    </MenuItem>
  )
}

export default Notifications
