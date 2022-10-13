import { useCallback, useState } from 'react'
import {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'

import { Col, Row } from 'antd'
import ListApp from './listApp'
import DragOverlayItem from './dragOverlayItem'

import { useHiddenAppIds } from 'hooks/useHiddenAppIds'
import { useAppIds } from 'hooks/useAppIds'
import { useRootDispatch } from 'store'
import { setHiddenAppIds, updateAppIds } from 'store/page.reducer'

import './index.os.less'

const Settings = () => {
  const dispatch = useRootDispatch()
  const [activeId, setActiveId] = useState<string>('')
  const appIds = useAppIds()
  const hiddenAppIds = useHiddenAppIds()
  const [internalAppIds, setInternalAppIds] = useState<Record<string, AppIds>>({
    appIds: appIds.filter((appId) => !hiddenAppIds.includes(appId)),
    hiddenAppIds,
  })
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 1 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 1 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const findContainer = useCallback(
    (id: string) => {
      if (id in internalAppIds) {
        return id
      }

      return Object.keys(internalAppIds).find((key) =>
        internalAppIds[key].includes(id),
      )
    },
    [internalAppIds],
  )

  const handleDragStart = ({ active }: DragStartEvent) =>
    setActiveId(active.id as string)

  const handleDragOver = ({ active, delta, over }: DragOverEvent) => {
    if (!over) return
    const id = active.id as string
    const overId = over.id as string
    // Find the containers
    const activeContainer = findContainer(id)
    const overContainer = findContainer(overId)

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return
    }

    setInternalAppIds((prev) => {
      const activeItems = prev[activeContainer]
      const overItems = prev[overContainer]

      // Find the indexes for the internalAppIds
      const activeIndex = activeItems.indexOf(id)
      const overIndex = overItems.indexOf(overId)

      let newIndex
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          delta.y > over.rect.top + over.rect.height

        const modifier = isBelowLastItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          internalAppIds[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      }
    })
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    const id = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(id)
    const overContainer = findContainer(overId)

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return
    }

    const activeIndex = internalAppIds[activeContainer].indexOf(id)
    const overIndex = internalAppIds[overContainer].indexOf(overId)

    if (activeIndex !== overIndex) {
      setInternalAppIds((internalAppIds) => ({
        ...internalAppIds,
        [overContainer]: arrayMove(
          internalAppIds[overContainer],
          activeIndex,
          overIndex,
        ),
      }))
    }

    const appIds = internalAppIds.appIds
    const hiddenAppIds = internalAppIds.hiddenAppIds

    setActiveId('')
    dispatch(setHiddenAppIds(hiddenAppIds))
    return dispatch(updateAppIds(appIds))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
    >
      <Row gutter={[0, 24]}>
        {Object.keys(internalAppIds).map((appId) => (
          <Col span={24} key={appId}>
            <ListApp
              id={appId}
              items={internalAppIds[appId]}
              activeId={activeId}
            />
          </Col>
        ))}
      </Row>
      <DragOverlayItem activeId="" />
    </DndContext>
  )
}

export default Settings
