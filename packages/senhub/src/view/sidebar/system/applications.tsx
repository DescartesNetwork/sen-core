import { Fragment, useState } from 'react'

import MenuItem from '../components/menuItem'
import AppSettings from 'view/appSettings'

import { MenuSystemItem } from '../constants'

export type ApplicationsProps = { visible?: boolean }

const Applications = ({ visible }: ApplicationsProps) => {
  const [openSettings, setOpenSettings] = useState(false)

  return (
    <Fragment>
      <MenuItem
        value={MenuSystemItem.AppSettings}
        onClick={() => setOpenSettings(true)}
        name={visible}
      >
        {MenuSystemItem.AppSettings}
      </MenuItem>
      <AppSettings open={openSettings} onClose={setOpenSettings} />
    </Fragment>
  )
}

export default Applications
