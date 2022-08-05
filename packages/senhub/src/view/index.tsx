import { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Layout, Row, Col, Card, Affix } from 'antd'
import PrivateRoute from 'components/privateRoute'
import Header from 'view/header'
import Welcome from 'view/welcome'
import Page from 'view/page'
import Sync from 'view/sync'
import Loading from 'view/loading'
import Marketplace from 'view/marketplace'

import Watcher from 'view/watcher'
import Installer from 'view/installer'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import { loadPage, loadRegister } from 'store/page.reducer'
import {
  loadDeveloperMode,
  loadVisited,
  updateLoading,
} from 'store/flags.reducer'
import { isAddress } from 'shared/util'
import { useWalletAddress } from 'hooks/useWallet'

import 'static/styles/dark.os.less'
import 'static/styles/light.os.less'
import DEFAULT_LIGHT_BG from 'static/images/bg/light-bg.png'
import DEFAULT_DARK_BG from 'static/images/bg/dark-bg.png'

const View = () => {
  const theme = useRootSelector((state: RootState) => state.ui.theme)
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
        if (Object.keys(register).length) await dispatch(loadPage())
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
    if (CSS.supports('background', bg)) {
      document.body.style.backgroundImage = ''
      document.body.style.backgroundColor = bg
    } else {
      document.body.style.backgroundImage = `url(${bg})`
      document.body.style.backgroundColor = ''
    }
  }, [theme, background])

  return (
    <Layout>
      {/* Header */}
      <Affix>
        <Card
          className="glass"
          style={{ borderRadius: '0px 0px 16px 16px' }}
          bodyStyle={{ padding: 16 }}
          bordered={false}
        >
          <Header />
        </Card>
      </Affix>
      {/* Body */}
      <Layout style={{ padding: '24px 12px 0px 12px' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
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
