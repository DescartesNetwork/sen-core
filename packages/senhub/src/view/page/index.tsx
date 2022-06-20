import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Row, Col } from 'antd'
import PageLoader from 'components/pageLoader'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'store'
import { setVisibleInstaller } from 'store/ui.reducer'
import { setValue } from 'store/search.reducer'

const Page = () => {
  const { appId } = useParams<{ appId: string }>()
  const appIds = useRootSelector((state: RootState) => state.page.appIds)
  const register = useRootSelector((state: RootState) => state.page.register)
  const loading = useRootSelector((state: RootState) => state.flags.loading)
  const dispatch = useRootDispatch<RootDispatch>()

  const existing = useMemo(
    () => appIds.includes(appId) && register[appId],
    [register, appIds, appId],
  )

  const openInstaller = useCallback(async () => {
    await dispatch(setVisibleInstaller(!existing))
    await dispatch(setValue(!existing ? appId : ''))
  }, [dispatch, existing, appId])

  useEffect(() => {
    if (!loading) openInstaller()
  }, [openInstaller, loading])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {existing ? (
          <PageLoader {...(register[appId] as ComponentManifest)} />
        ) : null}
      </Col>
    </Row>
  )
}

export default Page
