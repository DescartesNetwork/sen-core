import { useCallback, useEffect, useState, useMemo } from 'react'
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { Row, Col, Divider } from 'antd'
import ShowedApps from './showedApps'
import HiddenApps from './hiddenApps'

import { useRootDispatch } from 'store'
import { setHiddenAppIds, updateAppIds } from 'store/page.reducer'
import { useAppIds } from 'hooks/useAppIds'
import { useHiddenAppIds } from 'hooks/useHiddenAppIds'
import DraggableContext from 'components/dndkitContainer'
import AppDragOverlayItem from '../appDraggable/appDragOverlayItem'

export const ELEMENT_HIDDEN_ID = 'action-hidden'
export const ELEMENT_INSIDE_ID = 'active-in-sidebar'

const Settings = () => {
  const dispatch = useRootDispatch()

  const [internalAppIds, setInternalAppIds] = useState<AppIds>([])
  const [activeId, setActiveId] = useState<string>('')
  const appIds = useAppIds()
  const hiddenAppIds = useHiddenAppIds()

  useEffect(() => {
    setInternalAppIds(appIds)
  }, [appIds])

  const detectAvailableDrag = useCallback(
    (activeId: string, overId: string) => {
      const nextHiddenAppIds = [...hiddenAppIds]

      return (
        (!nextHiddenAppIds.includes(activeId) &&
          (!nextHiddenAppIds.includes(overId) ||
            overId !== ELEMENT_HIDDEN_ID) &&
          (overId === ELEMENT_INSIDE_ID || overId === activeId)) ||
        (nextHiddenAppIds.includes(activeId) &&
          (overId === ELEMENT_HIDDEN_ID || nextHiddenAppIds.includes(overId)))
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
      const activeId = active.id as string

      if (!over || detectAvailableDrag(activeId, over.id as string))
        return false
      onMoveAppIds(activeId)
      return true
    },
    [detectAvailableDrag, onMoveAppIds],
  )

  const onDragStart = ({ active }: DragStartEvent) =>
    setActiveId(active.id as string)
  const onDragOver = useCallback(
    ({ over, active }: DragOverEvent) => {
      if (!over) return setInternalAppIds(internalAppIds)
      const activeAppIndex = active.id as string
      const overAppIndex = (over.id as string) || activeAppIndex

      // Sort the AppIds sidebar
      const newAppIds = arrayMove(
        internalAppIds,
        internalAppIds.indexOf(activeAppIndex),
        internalAppIds.indexOf(overAppIndex),
      )
      // detect undefined value in sorted list
      if (!newAppIds) return
      for (const appId of newAppIds) {
        if (!appId) return
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
      if (!hiddenAppIds.includes(appId)) nextInternalAppIds.push(appId)
    }
    return nextInternalAppIds
  }, [hiddenAppIds, internalAppIds])

  return (
    <DraggableContext
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      activationConstraint={{ tolerance: 5, delay: 100 }}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <ShowedApps
            appIds={filteredInternalAppIds}
            moveToSidebar={onMoveAppIds}
            removeFromSidebar={onMoveAppIds}
            activeId={activeId}
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
            activeId={activeId}
          />
        </Col>
      </Row>
      <AppDragOverlayItem activeId={activeId} />
    </DraggableContext>
  )
}

export default Settings
