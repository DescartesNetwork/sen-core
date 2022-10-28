import { useCallback, useEffect, useMemo } from 'react'

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
import { useAppIds, useCurrentAppId } from 'hooks/useAppIds'
import { useRegisterSelector } from 'hooks/useRegister'

const Page = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const appId = useCurrentAppId() as string
  const appIds = useAppIds()
  const manifest = useRegisterSelector((register) => register[appId])
  const loading = useRootSelector(({ flags }: RootState) => flags.loading)

  const installed = useMemo(
    () => manifest && appIds.includes(appId),
    [manifest, appId, appIds],
  )

  const openInstaller = useCallback(async () => {
    await dispatch(setVisibleInstaller(!installed))
    await dispatch(setValue(!installed ? appId : ''))
  }, [dispatch, installed, appId])

  useEffect(() => {
    if (!loading) openInstaller()
  }, [openInstaller, loading])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {installed && manifest && <PageLoader {...manifest} />}
      </Col>
    </Row>
  )
}

export default Page
