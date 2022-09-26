import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'

import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

import { setVisibleSideBar } from 'store/sidebar.reducer'

const DEFAULT_POSITION_Y = 80
const enum WindowMouseEvent {
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  MouseMove = 'mousemove',
}
type KeyofMouseEvent =
  | WindowMouseEvent.MouseDown
  | WindowMouseEvent.MouseMove
  | WindowMouseEvent.MouseUp

let mouseDown = false

const ActionVisibleSideBar = () => {
  const visible = useRootSelector((state: RootState) => state.sidebar.visible)
  const dispatch = useRootDispatch<RootDispatch>()
  const [btnPosY, setBtnPosY] = useState(DEFAULT_POSITION_Y)
  const btnRef = useRef<HTMLElement>(null)

  const btnName = visible ? 'chevron-back-outline' : 'chevron-forward-outline'

  const onMouseDown = useCallback((event: KeyofMouseEvent) => {
    const btnElm = btnRef.current
    if (!btnElm) return
    window.addEventListener(event, (e) => {
      if (btnElm.contains(e.target as Node)) return (mouseDown = true)
    })
  }, [])

  const onMouseMove = useCallback((event: KeyofMouseEvent) => {
    window.addEventListener(event, (e) => {
      const posY = e.pageY
      const wHeight = window.innerHeight

      if (
        mouseDown &&
        posY > DEFAULT_POSITION_Y &&
        posY < wHeight - DEFAULT_POSITION_Y
      )
        setBtnPosY(wHeight - posY)
    })
  }, [])

  const windowRemoveEvent = useCallback(
    (event: string) => window.removeEventListener(event, () => {}),
    [],
  )

  // Mouse down
  useEffect(() => {
    onMouseDown(WindowMouseEvent.MouseDown)
    return () => windowRemoveEvent(WindowMouseEvent.MouseDown)
  })

  // Mouse up
  useEffect(() => {
    window.addEventListener(WindowMouseEvent.MouseUp, () => (mouseDown = false))
    return () => windowRemoveEvent(WindowMouseEvent.MouseUp)
  })

  // Mouse move
  useEffect(() => {
    onMouseMove(WindowMouseEvent.MouseMove)
    return () => windowRemoveEvent(WindowMouseEvent.MouseMove)
  })

  return (
    <Button
      ref={btnRef}
      style={{ bottom: btnPosY }}
      className="btn-visible-sidebar"
      icon={<IonIcon name={btnName} />}
      onClick={() => dispatch(setVisibleSideBar(!visible))}
    />
  )
}

export default ActionVisibleSideBar
