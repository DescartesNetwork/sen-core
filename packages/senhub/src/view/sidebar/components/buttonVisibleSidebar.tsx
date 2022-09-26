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

  const onMouseEvent = useCallback((event: KeyofMouseEvent) => {
    window.addEventListener(event, (e) => {
      const btnElm = btnRef.current
      if (!btnElm) return

      const posY = e.pageY
      const type = e.type
      const wHeight = window.innerHeight

      if (
        type === WindowMouseEvent.MouseDown &&
        btnElm.contains(e.target as Node)
      )
        mouseDown = true
      if (type === WindowMouseEvent.MouseUp) mouseDown = false
      if (
        mouseDown &&
        type === WindowMouseEvent.MouseMove &&
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
    onMouseEvent(WindowMouseEvent.MouseDown)
    return () => windowRemoveEvent(WindowMouseEvent.MouseDown)
  })

  // Mouse up
  useEffect(() => {
    onMouseEvent(WindowMouseEvent.MouseUp)
    return () => windowRemoveEvent(WindowMouseEvent.MouseUp)
  })

  // Mouse move
  useEffect(() => {
    onMouseEvent(WindowMouseEvent.MouseMove)
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
