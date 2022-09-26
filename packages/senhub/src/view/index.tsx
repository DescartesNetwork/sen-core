import { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Layout, Row, Col } from 'antd'
import PrivateRoute from 'components/privateRoute'
import Welcome from 'view/welcome'
import Page from 'view/page'
import Sync from 'view/sync'
import Loading from 'view/loading'
import Marketplace from 'view/marketplace'
import Watcher from 'view/watcher'
import Installer from 'view/installer'
import SideBar from './sidebar'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import { loadPage } from 'store/page.reducer'
import { loadRegister } from 'store/register.reducer'
import {
  loadDeveloperMode,
  loadVisited,
  updateLoading,
} from 'store/flags.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'
import { useInfix, useTheme } from 'hooks/useUI'
import { login } from 'store/user.reducer'
import { Infix } from 'store/ui.reducer'

import DEFAULT_LIGHT_BG from 'static/images/bg/light-bg.png'
import DEFAULT_DARK_BG from 'static/images/bg/dark-bg.png'
import 'static/styles/dark.os.less'
import 'static/styles/light.os.less'

const ROW_STICKY = { overflow: 'auto', maxHeight: '100vh' }
const COL_STICKY = { position: 'sticky', top: 0, left: 0, zIndex: 9 }

const View = () => {
  const theme = useTheme()
  const background = useRootSelector((state: RootState) => state.ui.background)
  const walletAddress = useWalletAddress()
  const dispatch = useRootDispatch<RootDispatch>()
  const infix = useInfix()

  const isMobile = infix < Infix.sm
  const rowStyle = !isMobile ? ROW_STICKY : {}
  const colStyle = !isMobile ? COL_STICKY : {}

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
          const appIds = await dispatch(loadPage()).unwrap()
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
      {/* remove padding cause sidebar need full screen */}
      {/* <Layout style={{ padding: '24px 12px 0px 12px' }}> */}
      <Layout style={{ overflow: 'hidden' }}>
        <Row gutter={[0, 24]} style={{ ...rowStyle }} wrap={false}>
          <Col style={{ ...colStyle }}>
            <SideBar />
          </Col>
          <Col flex="auto">
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
          </Col>
        </Row>
      </Layout>

      {/* In-Background Run Jobs */}
      <Loading />
      <Watcher />
      <Installer />
    </Layout>
  )
}

export default View
