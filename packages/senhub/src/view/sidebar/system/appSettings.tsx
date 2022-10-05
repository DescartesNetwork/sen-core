import { MenuSystemItem } from '../index'
import MenuItem from '../components/menuItem'

export type AppSettingsProps = { visible?: boolean }

const AppSettings = ({ visible }: AppSettingsProps) => {
  return (
    <MenuItem
      value={MenuSystemItem.AppSettings}
      onClick={() => {}}
      name={visible}
    >
      {MenuSystemItem.AppSettings}
    </MenuItem>
  )
}

export default AppSettings
