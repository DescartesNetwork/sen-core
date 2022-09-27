import { useCallback, useMemo } from 'react'
import copy from 'copy-to-clipboard'

import { Menu } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useUninstallApp } from 'hooks/useUninstallApp'
import { useGoToStore } from 'hooks/useGotoStore'
import { useGoToApp } from 'hooks/useGotoApp'

export type ContextMenuProps = { appId: string }

export const ContextMenu = ({ appId }: ContextMenuProps) => {
  const onOpenInNewTab = useGoToApp({ appId, blank: true })
  const onCopyInstantLink = useCallback(() => {
    copy(`${window.location.origin}/app/${appId}?autoInstall=true`)
    return window.message({
      type: 'info',
      description: 'The link has been copied.',
    })
  }, [appId])
  const onViewInStore = useGoToStore({ appId, blank: true })
  const onUninstall = useUninstallApp(appId)

  const fullscreen = useMemo(() => {
    return document.getElementById(`${appId}-iframe`)
  }, [appId])
  const onFullscreen = useCallback(
    () => fullscreen?.requestFullscreen(),
    [fullscreen],
  )

  return (
    <Menu
      items={[
        {
          key: 'open-in-new-tab',
          label: 'Open in New Tab',
          icon: <IonIcon name="open-outline" />,
          onClick: onOpenInNewTab,
        },
        {
          key: 'fullscreen',
          label: 'Fullscreen',
          icon: <IonIcon name="scan-outline" />,
          onClick: onFullscreen,
          disabled: !fullscreen,
        },
        {
          key: 'copy-instant-link',
          label: 'Copy Instant Link',
          icon: <IonIcon name="arrow-redo-outline" />,
          onClick: onCopyInstantLink,
        },
        {
          key: 'view-in-store',
          label: 'View in Store',
          icon: <IonIcon name="eye-outline" />,
          onClick: onViewInStore,
        },
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

export default ContextMenu
