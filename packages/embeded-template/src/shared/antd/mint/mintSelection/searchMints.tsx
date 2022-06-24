import { useCallback, useEffect, useState } from 'react'
import LazyLoad from '@sentre/react-lazyload'

import { Button, Empty, Col, Input, Row, Spin } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import MintTag from './mintTag'
import MintCard from './mintCard'
import LoadMore from './loadMore'

import { useRecommendedMints } from './hooks/useRecommendedMints'
import { useSearchedMints } from './hooks/useSearchedMints'

const LIMIT = 30
const AMOUNT_BEFORE_LOAD_MORE = 5
let timeOutLoadMore: NodeJS.Timeout

export type SearchMintsProps = {
  value?: string
  onChange?: (value: string) => void
  visible?: boolean
  onClose?: () => void
}

const SearchMints = ({
  value = '',
  onChange = () => {},
  visible,
}: SearchMintsProps) => {
  const [keyword, setKeyword] = useState('')
  const [offset, setOffset] = useState(LIMIT)
  const { recommendedMints, addRecommendMint } = useRecommendedMints()
  const { searchedMints, loading } = useSearchedMints(keyword)

  const onSelect = useCallback(
    (mintAddress: string) => {
      onChange(mintAddress)
      addRecommendMint(mintAddress)
    },
    [onChange, addRecommendMint],
  )

  useEffect(() => {
    setOffset(LIMIT)
    const list = document.getElementById('sentre-token-selection-list')
    if (list) list.scrollTop = 0
  }, [keyword, visible])

  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <Input
          placeholder="Search token symbol, name, address, ..."
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              icon={
                <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
              }
              onClick={keyword ? () => setKeyword('') : () => {}}
              loading={loading}
            />
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value || '')}
        />
      </Col>
      {!keyword.length && (
        <Col span={24}>
          <Row gutter={[8, 8]}>
            {recommendedMints.map((mintAddress) => (
              <Col xs={12} sm={8} md={6} key={mintAddress}>
                <MintTag
                  mintAddress={mintAddress}
                  onClick={onSelect}
                  active={mintAddress === value}
                />
              </Col>
            ))}
          </Row>
        </Col>
      )}
      <Col span={24}>
        <Spin
          spinning={loading}
          tip={!keyword.length ? 'Loading...' : 'Searching...'}
        >
          <Row
            gutter={[8, 8]}
            style={{ maxHeight: 360, paddingRight: 4, minHeight: 50 }}
            className="scrollbar"
            id="sentre-token-selection-list"
            justify="center"
          >
            {searchedMints.length || loading ? (
              searchedMints.slice(0, offset).map((mintAddress, index) => (
                <Col span={24} key={mintAddress + index}>
                  <LazyLoad height={60} overflow throttle={300}>
                    <MintCard mintAddress={mintAddress} onClick={onSelect} />
                  </LazyLoad>
                  {index === offset - AMOUNT_BEFORE_LOAD_MORE && (
                    <LoadMore
                      callback={() => {
                        if (timeOutLoadMore) clearTimeout(timeOutLoadMore)
                        timeOutLoadMore = setTimeout(
                          () => setOffset(offset + LIMIT),
                          250,
                        )
                      }}
                    />
                  )}
                </Col>
              ))
            ) : (
              <Col>
                <Empty style={{ padding: 40 }} />
              </Col>
            )}
          </Row>
        </Spin>
      </Col>
    </Row>
  )
}

export default SearchMints
