import { useEffect, createRef, useCallback } from 'react'
import { Remarkable } from 'remarkable'

import { Row, Col } from 'antd'
import { StaticLoader } from 'components/staticLoader'

const Markdown = ({ src }: { src: string }) => {
  const ref = createRef<HTMLDivElement>()

  const fetchData = useCallback(async () => {
    let txt = ''
    try {
      // Parse data
      if (!src) throw new Error('Invalid source url ')
      txt = await (await fetch(src)).text()
    } catch (er) {
      txt = 'Cannot load the README.md'
    }
    const md = new Remarkable({ html: true })
    if (ref.current) ref.current.innerHTML = md.render(txt)
  }, [src, ref])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} ref={ref} />
    </Row>
  )
}

export type ReadmeLoaderProps = {
  appId: string
}

const ReadmeLoader = (props: ReadmeLoaderProps) => {
  const { appId } = props
  return (
    <StaticLoader
      type="readme"
      appId={appId}
      render={(src) => <Markdown src={src} />}
    />
  )
}

export default ReadmeLoader
