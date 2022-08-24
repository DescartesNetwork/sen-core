import { useMemo } from 'react'

import { Button, Space, Typography } from 'antd'
import AppIcon from 'components/appIcon'

import { useGoToApp } from 'hooks/useGotoApp'
import { useInstallApp } from 'hooks/useInstallApp'
import { useRegisterSelector } from 'hooks/useRegister'
import { useAppIds } from 'hooks/useAppIds'

export type CustomAppIconProps = { appId: string }

const CustomAppIcon = ({ appId }: CustomAppIconProps) => {
  const manifest = useRegisterSelector((register) => register[appId])
  const appIds = useAppIds()
  const onOpen = useGoToApp({ appId })
  const onInstall = useInstallApp(appId)

  const { name: appName } = useMemo(
    () => manifest || { name: 'Unknown' },
    [manifest],
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
