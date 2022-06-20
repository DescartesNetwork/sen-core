import { StaticLoader } from 'components/staticLoader'
import RawAppIcon, { RawAppIconProps } from './rawAppIcon'

export type AppIconProps = Omit<RawAppIconProps, 'src'>

const AppIcon = (props: AppIconProps) => {
  return (
    <StaticLoader
      type="logo"
      appId={props.appId}
      render={(src) => <RawAppIcon {...props} src={src} />}
    />
  )
}

export default AppIcon
