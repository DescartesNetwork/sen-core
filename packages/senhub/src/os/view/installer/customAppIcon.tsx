import { useMemo } from 'react'

import { Button, Space, Typography } from 'antd'
import AppIcon from 'os/components/appIcon'

import { RootState, useRootSelector } from 'os/store'
import { useGoToApp } from 'os/hooks/useGotoApp'
import { useInstallApp } from 'os/hooks/useInstallApp'

export type CustomAppIconProps = { appId: string }

const CustomAppIcon = ({ appId }: CustomAppIconProps) => {
  const register = useRootSelector((state: RootState) => state.page.register)
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const onOpen = useGoToApp({ appId })
  const onInstall = useInstallApp(appId)

  const { name: appName } = useMemo(
    () => register[appId] || { name: 'Unknown' },
    [register, appId],
  )
  const installed = useMemo(() => appIds.includes(appId), [appIds, appId])

  return (
    <Space size={16}>
      <AppIcon name={false} appId={appId} />
      <Space direction="vertical">
        <Typography.Text>{appName}</Typography.Text>
        <Button
          onClick={installed ? onOpen : onInstall}
          type={installed ? undefined : 'primary'}
          size="small"
        >
          {installed ? 'Open' : 'Install'}
        </Button>
      </Space>
    </Space>
  )
}

export default CustomAppIcon
