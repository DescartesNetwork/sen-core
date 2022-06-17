import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { Row, Col, Input, Button, Modal, Divider } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  useRootDispatch,
  useRootSelector,
  RootState,
  RootDispatch,
} from 'os/store'
import { setValue, setVisible } from 'os/store/search.reducer'
import Result from './result'

const Search = forwardRef((_, ref: any) => {
  const [cursor, setCursor] = useState<number | null>(null)
  const innerRef = useRef(ref)
  const dispatch = useRootDispatch<RootDispatch>()
  const { pathname, search } = useLocation()
  const history = useHistory()
  const visible = useRootSelector((state: RootState) => state.search.visible)
  const value = useRootSelector((state: RootState) => state.search.value)
  const loading = useRootSelector((state: RootState) => state.search.loading)
  const disabled = useRootSelector((state: RootState) => state.search.disabled)

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setCursor(e.target.selectionStart)
      dispatch(setValue(e.target.value))
    },
    [dispatch],
  )
  const onClear = useCallback(() => {
    dispatch(setValue(''))
    history.push(pathname)
  }, [dispatch, history, pathname])

  useEffect(() => {
    const params = new URLSearchParams(search)
    dispatch(setValue(params.get('search') || ''))
  }, [dispatch, search])

  // Handle cursor jumping
  // To prevent autofocus on mobile, we must strictly check cursor different from null
  if (cursor !== null) innerRef?.current?.setSelectionRange(cursor, cursor)

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(setVisible(false))}
      closeIcon={<IonIcon name="close-outline" />}
      footer={null}
    >
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Input
            placeholder="Search"
            bordered={false}
            onChange={onChange}
            value={value}
            prefix={
              <Button
                type="text"
                size="small"
                icon={
                  <IonIcon
                    name={value ? 'close-circle-outline' : 'search-outline'}
                  />
                }
                loading={loading}
                disabled={disabled}
                onClick={value ? onClear : () => {}}
              />
            }
            disabled={disabled}
            ref={innerRef}
            style={{ marginLeft: -16 }}
            autoFocus
          />
        </Col>
        <Col span={24}>
          <Divider style={{ margin: 0 }} />
        </Col>
        <Col span={24}>
          <Result value={value} />
        </Col>
      </Row>
    </Modal>
  )
})

export default Search
