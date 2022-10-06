import { useMemo } from 'react'

import { Menu } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useUninstallApp } from 'hooks/useUninstallApp'
import { useGoToApp } from 'hooks/useGotoApp'

export type AppActionsProps = {
  appId: string
  hidden?: boolean
  moveToSidebar?: () => void
  removeFromSidebar?: () => void
}

export const AppActions = ({
  appId,
  hidden = false,
  moveToSidebar = () => {},
  removeFromSidebar = () => {},
}: AppActionsProps) => {
  const onOpenInNewTab = useGoToApp({ appId, blank: false })
  const onUninstall = useUninstallApp(appId)

  const configsMenu = useMemo(() => {
    if (hidden)
      return {
        key: 'move-to-sidebar',
        label: 'Move to sidebar',
        icon: <IonIcon name="eye-outline" />,
        onClick: moveToSidebar,
      }
    return {
      key: 'remove-from-sidebar',
      label: 'Remove from sidebar',
      icon: <IonIcon name="eye-outline" />,
      onClick: removeFromSidebar,
    }
  }, [hidden, moveToSidebar, removeFromSidebar])

  return (
    <Menu
      items={[
        {
          key: 'go-to-app',
          label: 'Open app',
          icon: <IonIcon name="open-outline" />,
          onClick: onOpenInNewTab,
        },
        { ...configsMenu },
        {
          key: 'uninstall',
          label: 'Uninstall',
          icon: <IonIcon name="trash-outline" />,
          onClick: onUninstall,
          danger: true,
        },
      ]}
    />
  )
}

export default AppActions
