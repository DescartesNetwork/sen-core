import { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Layout } from 'antd'
import PrivateRoute from 'components/privateRoute'
import Welcome from 'view/welcome'
import Page from 'view/page'
import Sync from 'view/sync'
import Loading from 'view/loading'
import Marketplace from 'view/marketplace'
import Watcher from 'view/watcher'
import Installer from 'view/installer'
import SideBar from './sidebar'
import SentreLayout from 'components/sentreLayout'
import LayoutBody from 'components/sentreLayout/layoutBody'
import LayoutSideBar from 'components/sentreLayout/layoutSidebar'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import { loadRegister } from 'store/register.reducer'
import {
  loadDeveloperMode,
  loadVisited,
  updateLoading,
} from 'store/flags.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { useTheme } from 'hooks/useUI'
import { login } from 'store/user.reducer'
import { loadAppIds } from 'store/page.reducer'

import DEFAULT_LIGHT_BG from 'static/images/bg/light-bg.png'
import DEFAULT_DARK_BG from 'static/images/bg/dark-bg.png'
import 'static/styles/dark.os.less'
import 'static/styles/light.os.less'

const View = () => {
  const theme = useTheme()
  const background = useRootSelector((state: RootState) => state.ui.background)
  const walletAddress = useWalletAddress()
  const dispatch = useRootDispatch<RootDispatch>()

  // Load DApp flags, registry, page
  useEffect(() => {
    ;(async () => {
      if (!isAddress(walletAddress)) return dispatch(loadRegister())
      try {
        await dispatch(updateLoading(true))
        await dispatch(loadVisited())
        await dispatch(loadDeveloperMode())
        const register = await dispatch(loadRegister()).unwrap()
        if (Object.keys(register).length) {
          const { appIds } = await dispatch(loadAppIds()).unwrap()
          await dispatch(login(appIds)).unwrap()
        }
      } catch (er: any) {
        window.notify({ type: 'warning', description: er.message })
      } finally {
        dispatch(updateLoading(false))
      }
    })()
  }, [dispatch, walletAddress])
  // Load theme & background
  useEffect(() => {
    document.body.setAttribute('id', theme)
    const DEFAULT_BG = theme === 'light' ? DEFAULT_LIGHT_BG : DEFAULT_DARK_BG
    const bg = background[theme] || DEFAULT_BG
    document.body.style.background = '' // Clear previous background
    if (CSS.supports('background', bg)) document.body.style.background = bg
    else document.body.style.backgroundImage = `url(${bg})`
  }, [theme, background])

  return (
    <Layout>
      {/* Body */}
      <SentreLayout>
        <LayoutSideBar>
          <SideBar />
        </LayoutSideBar>
        <LayoutBody>
          <Switch>
            <Route exact path="/welcome" component={Welcome} />
            {/* DApp Store */}
            <Route exact path="/app/store/:appId?" component={Marketplace} />
            <Route
              path="/store"
              render={({ location: { pathname, search } }) => (
                <Redirect to={{ pathname: `/app${pathname}`, search }} />
              )}
            />
            {/* End App Store */}
            <PrivateRoute path="/app/:appId" component={Page} />
            <PrivateRoute exact path="/sync" component={Sync} />
            <Redirect from="*" to="/welcome" />
          </Switch>
        </LayoutBody>
      </SentreLayout>

      {/* In-Background Run Jobs */}
      <Loading />
      <Watcher />
      <Installer />
    </Layout>
  )
}

export default View
