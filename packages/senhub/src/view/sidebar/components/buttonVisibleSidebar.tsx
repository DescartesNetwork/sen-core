import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  RootDispatch,
  RootState,
  useRootDispatch,
  useRootSelector,
} from 'store'

import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

import { setVisibleNagivation } from 'store/ui.reducer'

const DEFAULT_POSITION_Y = 80
let mouseDown = false
const ICON_BACK_NAME = 'chevron-back-outline'
const ICON_FORWARD_NAME = 'chevron-forward-outline'
const ICON_POSITION = {
  right: {
    back: ICON_BACK_NAME,
    forward: ICON_FORWARD_NAME,
  },
  left: {
    back: ICON_FORWARD_NAME,
    forward: ICON_BACK_NAME,
  },
}
const RADIUS = {
  right: '0 8px 8px 0',
  left: '8px 0 0 8px',
}

const enum WindowMouseEvent {
  MouseDown = 'mousedown',
  MouseUp = 'mouseup',
  MouseMove = 'mousemove',
  TouchStart = 'touchstart',
  TouchMove = 'touchmove',
  TouchEnd = 'touchend',
}
type KeyofMouseEvent =
  | WindowMouseEvent.MouseDown
  | WindowMouseEvent.MouseMove
  | WindowMouseEvent.MouseUp
type KeyofTouchEvent =
  | WindowMouseEvent.TouchStart
  | WindowMouseEvent.TouchMove
  | WindowMouseEvent.TouchEnd

const ActionVisibleSideBar = () => {
  const visible = useRootSelector(
    (state: RootState) => state.ui.visibleNavigation,
  )
  const sidebarPosition = useRootSelector(
    (state: RootState) => state.ui.sidebarPosition,
  )
  const dispatch = useRootDispatch<RootDispatch>()
  const [btnPosY, setBtnPosY] = useState(DEFAULT_POSITION_Y)
  const btnRef = useRef<HTMLElement>(null)

  const btnPosition = sidebarPosition === 'right' ? 'left' : 'right'
  const btnName = useMemo(
    () =>
      visible
        ? ICON_POSITION[btnPosition].back
        : ICON_POSITION[btnPosition].forward,
    [btnPosition, visible],
  )

  const onStartAction = useCallback(
    (event: KeyofMouseEvent | KeyofTouchEvent) => {
      const btnElm = btnRef.current
      if (!btnElm) return
      window.addEventListener(event, (e) => {
        if (btnElm.contains(e.target as Node)) return (mouseDown = true)
      })
    },
    [],
  )

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

  const onTouchMove = useCallback((event: KeyofTouchEvent) => {
    const btnElm = btnRef.current
    if (!btnElm) return

    window.addEventListener(event, (e) => {
      const touch = e.touches[0] || e.changedTouches[0]
      const posY = touch.pageY
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
    onStartAction(WindowMouseEvent.MouseDown)
    return () => windowRemoveEvent(WindowMouseEvent.MouseDown)
  }, [onStartAction, windowRemoveEvent])

  // Mouse up
  useEffect(() => {
    window.addEventListener(WindowMouseEvent.MouseUp, () => (mouseDown = false))
    return () => windowRemoveEvent(WindowMouseEvent.MouseUp)
  }, [windowRemoveEvent])

  // Mouse move
  useEffect(() => {
    onMouseMove(WindowMouseEvent.MouseMove)
    return () => windowRemoveEvent(WindowMouseEvent.MouseMove)
  }, [onMouseMove, windowRemoveEvent])

  // Touch start
  useEffect(() => {
    onStartAction(WindowMouseEvent.TouchStart)
    return () => windowRemoveEvent(WindowMouseEvent.TouchStart)
  }, [onStartAction, windowRemoveEvent])

  // Touch end
  useEffect(() => {
    window.addEventListener(
      WindowMouseEvent.TouchEnd,
      () => (mouseDown = false),
    )
    return () => windowRemoveEvent(WindowMouseEvent.TouchEnd)
  }, [windowRemoveEvent])

  // Touch move
  useEffect(() => {
    onTouchMove(WindowMouseEvent.TouchMove)
    return () => windowRemoveEvent(WindowMouseEvent.TouchMove)
  }, [onTouchMove, windowRemoveEvent])

  return (
    <Button
      ref={btnRef}
      style={{
        bottom: btnPosY,
        [btnPosition]: -25,
        borderRadius: RADIUS[btnPosition],
      }}
      className="btn-visible-sidebar"
      icon={<IonIcon name={btnName} />}
      onClick={() => dispatch(setVisibleNagivation(!visible))}
    />
  )
}

export default ActionVisibleSideBar
