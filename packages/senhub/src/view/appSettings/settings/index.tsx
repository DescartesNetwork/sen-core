import { useCallback, useEffect, useState, useMemo } from 'react'
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

import { Row, Col, Divider } from 'antd'
import AppIcon from 'components/appIcon'
import ShowedApps from './showedApps'
import HiddenApps from './hiddenApps'

import { RootState, useRootDispatch, useRootSelector } from 'store'
import { setHiddenAppIds, updateAppIds } from 'store/page.reducer'
import { useAppIds } from 'hooks/useAppIds'

export const ELEMENT_HIDDEN_ID = 'action-hidden'
export const ELEMENT_INSIDE_ID = 'active-in-sidebar'

// Mixed Strategy
const mixedStrategy = (
  ...args: Parameters<typeof rectIntersection | typeof closestCorners>
) => {
  const intersecting = rectIntersection(...args)
  return intersecting ? intersecting : closestCorners(...args)
}

const Settings = () => {
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

  const onMoveAppIds = useCallback(
    (appId: string) => {
      const nextHiddenAppIds = [...hiddenAppIds]
      const idxHiddenAppId = nextHiddenAppIds.indexOf(appId)
      if (idxHiddenAppId < 0) nextHiddenAppIds.push(appId)
      else nextHiddenAppIds.splice(idxHiddenAppId, 1)

      dispatch(setHiddenAppIds(nextHiddenAppIds))
    },
    [dispatch, hiddenAppIds],
  )

  const dragHiddenApps = useCallback(
    ({ over, active }: DragEndEvent) => {
      const activeId = active.id
      if (!over || detectAvailableDrag(activeId, over.id)) return false

      onMoveAppIds(activeId)
      return true
    },
    [detectAvailableDrag, onMoveAppIds],
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
    if (dragHiddenApps(event)) return
    return dispatch(updateAppIds(internalAppIds))
  }

  const filteredInternalAppIds = useMemo(() => {
    const nextInternalAppIds: AppIds = []
    for (const appId of internalAppIds) {
      if (hiddenAppIds.includes(appId)) continue
      nextInternalAppIds.push(appId)
    }
    return nextInternalAppIds
  }, [hiddenAppIds, internalAppIds])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={mixedStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <ShowedApps
            appIds={filteredInternalAppIds}
            moveToSidebar={onMoveAppIds}
            removeFromSidebar={onMoveAppIds}
          />
        </Col>
        <Col span={24}>
          <Divider style={{ margin: 0 }} type="horizontal" dashed />
        </Col>
        <Col span={24}>
          <HiddenApps
            hiddenAppIds={hiddenAppIds}
            moveToSidebar={onMoveAppIds}
            removeFromSidebar={onMoveAppIds}
          />
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

export default Settings
