import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  rectIntersection,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { Row, Col, Empty, Typography, Divider } from 'antd'
import AppIcon from 'components/appIcon'
import DroppablePage from './droppablePage'
import DraggableIcon from './draggableIcon'

import { RootState, useRootDispatch, useRootSelector } from 'store'
import { setHiddenAppIds, updateAppIds } from 'store/page.reducer'
import { useAppIds } from 'hooks/useAppIds'
import { useMemo } from 'react'

const ELEMENT_HIDDEN_ID = 'action-hidden'
const ELEMENT_INSIDE_ID = 'active-in-sidebar'

// Mixed Strategy
const mixedStrategy = (
  ...args: Parameters<typeof rectIntersection | typeof closestCorners>
) => {
  const intersecting = rectIntersection(...args)
  return intersecting ? intersecting : closestCorners(...args)
}

export type WidgetLayoutProps = {
  disabled?: boolean
  onHiddenApp?: (appIds: AppIds) => void
}

const WidgetLayout = ({
  disabled = false,
  onHiddenApp = () => {},
}: WidgetLayoutProps) => {
  const dispatch = useRootDispatch()
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 10, delay: 200, tolerance: 5 },
    }),
  )
  const [internalAppIds, setInternalAppIds] = useState<AppIds>([])
  const [activeId, setActiveId] = useState<string>('')
  const appIds = useAppIds()
  const hiddenAppIds = useRootSelector(
    (state: RootState) => state.page.hiddenAppIds,
  )

  const filteredInternalAppIds = useMemo(() => {
    const nextInternalAppIds: AppIds = []
    for (const appId of internalAppIds) {
      if (hiddenAppIds.includes(appId)) continue
      nextInternalAppIds.push(appId)
    }
    return nextInternalAppIds
  }, [hiddenAppIds, internalAppIds])

  useEffect(() => {
    setInternalAppIds(appIds)
  }, [appIds])

  const detectAvailableDrag = useCallback(
    (activeId: string, overId: string) => {
      return (
        (!hiddenAppIds.includes(activeId) &&
          (overId === ELEMENT_INSIDE_ID || overId === activeId)) ||
        (hiddenAppIds.includes(activeId) &&
          (overId === ELEMENT_HIDDEN_ID || hiddenAppIds.includes(overId)))
      )
    },
    [hiddenAppIds],
  )

  const handleHiddenApps = useCallback(
    ({ over, active }: DragEndEvent) => {
      const nextHiddenAppIds: AppIds = [...hiddenAppIds]
      const nextInternalAppIds: AppIds = [...appIds]
      const activeId = active.id

      if (!over || detectAvailableDrag(activeId, over.id)) return false
      const idxHiddenAppIds = nextHiddenAppIds.indexOf(activeId)

      if (idxHiddenAppIds < 0) nextHiddenAppIds.push(activeId)
      else nextHiddenAppIds.splice(idxHiddenAppIds, 1)

      setInternalAppIds(nextInternalAppIds)
      dispatch(setHiddenAppIds(nextHiddenAppIds))
      return true
    },
    [appIds, detectAvailableDrag, dispatch, hiddenAppIds],
  )

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(active.id)
  const onDragOver = useCallback(
    ({ over, active }: DragOverEvent) => {
      if (!over) return setInternalAppIds(internalAppIds)
      const activeAppIndex = active.id
      const overAppIndex = over.id || activeAppIndex

      // Sort the AppIds sidebar
      const newAppIds = arrayMove(
        internalAppIds,
        internalAppIds.indexOf(activeAppIndex),
        internalAppIds.indexOf(overAppIndex),
      )
      // detect undefinded value in sorted list
      if (!newAppIds) return
      for (const appId of newAppIds) {
        if (appId) continue
        return
      }
      // Update new pages
      return setInternalAppIds(newAppIds)
    },
    [internalAppIds],
  )

  const onDragEnd = async (event: DragEndEvent) => {
    if (activeId) setActiveId('') // Disable button action after drag
    if (handleHiddenApps(event)) return
    return dispatch(updateAppIds(internalAppIds))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={mixedStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <DroppablePage
            id={ELEMENT_INSIDE_ID}
            items={filteredInternalAppIds}
            disabled={disabled}
          >
            <Row gutter={[0, 8]} justify="center">
              <Col span={24}>
                <Typography.Text type="secondary">IN SIDEBAR</Typography.Text>
              </Col>
              <Col span={24} /> {/* safe space */}
              {!filteredInternalAppIds.length ? (
                <Col>
                  <Empty />
                </Col>
              ) : (
                filteredInternalAppIds.map((appId) => (
                  <Col span={24} key={appId}>
                    <DraggableIcon
                      key={appId}
                      appId={appId}
                      disabled={disabled}
                      size={32}
                    />
                  </Col>
                ))
              )}
            </Row>
          </DroppablePage>
        </Col>
        <Col span={24}>
          <Divider style={{ margin: 0 }} type="horizontal" dashed />
        </Col>
        <Col span={24}>
          <DroppablePage id={ELEMENT_HIDDEN_ID} items={hiddenAppIds}>
            <Row gutter={[16, 16]}>
              {hiddenAppIds.map((appId) => (
                <Col span={24} key={appId}>
                  <DraggableIcon
                    key={appId}
                    appId={appId}
                    disabled={disabled}
                    size={32}
                  />
                </Col>
              ))}
            </Row>
          </DroppablePage>
        </Col>
      </Row>

      <DragOverlay>
        {activeId ? (
          <span style={{ opacity: 0.5 }}>
            <AppIcon appId={activeId} direction="horizontal" size={40} />
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetLayout
