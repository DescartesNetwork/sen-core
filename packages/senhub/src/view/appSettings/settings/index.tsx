import { useCallback, useEffect, useState } from 'react'
import {
  DragEndEvent,
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'

import { Col, Row } from 'antd'
import ListApp from './listApp'

import { useAppIds } from 'hooks/useAppIds'
import { useRootDispatch } from 'store'
import { updateAppIds } from 'store/user.reducer'

const Settings = () => {
  const dispatch = useRootDispatch()
  const appIds = useAppIds()
  const [internalAppIds, setInternalAppIds] = useState<AppIds>(appIds)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 1 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 1 } }),
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return
      const oldIndex = internalAppIds.indexOf(active.id.toString())
      const newIndex = internalAppIds.indexOf(over.id.toString())
      const nextAppIds = arrayMove(internalAppIds, oldIndex, newIndex)
      setInternalAppIds(nextAppIds)
      return dispatch(updateAppIds([...nextAppIds]))
    },
    [dispatch, internalAppIds],
  )

  useEffect(() => {
    setInternalAppIds(appIds)
  }, [appIds])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <ListApp items={internalAppIds} />
        </Col>
      </Row>
    </DndContext>
  )
}

export default Settings
