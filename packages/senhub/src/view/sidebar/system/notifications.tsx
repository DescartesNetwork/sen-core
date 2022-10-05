import IonIcon from '@sentre/antd-ionicon'
import { MenuSystemItem } from '../index'
import MenuItem from '../components/menuItem'

export type NotificationsProps = { visible?: boolean }

const Notifications = ({ visible }: NotificationsProps) => {
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

export default Notifications
