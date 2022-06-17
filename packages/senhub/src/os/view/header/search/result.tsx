import { useCallback, useEffect, useMemo, useState } from 'react'

import { Row, Col, Typography } from 'antd'
import AppCard from 'os/view/market/appCard'

import {
  useRootDispatch,
  useRootSelector,
  RootDispatch,
  RootState,
} from 'os/store'
import { setLoading } from 'os/store/search.reducer'
import SearchEngine from './searchEngine'

let searching: NodeJS.Timeout

const Result = ({ value }: { value: string }) => {
  const dispatch = useRootDispatch<RootDispatch>()
  const register = useRootSelector((state: RootState) => state.page.register)
  const [appIds, setAppIds] = useState<AppIds>([])

  const engine = useMemo(() => new SearchEngine(register), [register])

  const onSearch = useCallback(async () => {
    await dispatch(setLoading(true))
    if (searching) clearTimeout(searching)
    searching = setTimeout(async () => {
      const appIds = engine.search(value)
      setAppIds(appIds)
      await dispatch(setLoading(false))
    }, 500)
  }, [dispatch, engine, value])

  useEffect(() => {
    onSearch()
  }, [onSearch])

  return (
    <Row gutter={[24, 24]}>
      {!appIds.length ? (
        <Col span={24}>
          <Typography.Text type="secondary">No result</Typography.Text>
        </Col>
      ) : null}
      {appIds.map((appId) => (
        <Col xs={24} sm={12} key={appId}>
          <AppCard appId={appId} />
        </Col>
      ))}
    </Row>
  )
}

export default Result
