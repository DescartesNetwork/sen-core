import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Col } from 'antd'
import AppIcon from 'os/components/appIcon'

/**
 * DraggableIcon render as a Col
 */
const DraggableIcon = ({
  appId,
  size = 64,
  onClick = () => {},
  disabled = false,
}: {
  appId: string
  size?: number
  onClick?: () => void
  disabled?: boolean
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: appId,
      disabled,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition,
  }

  return (
    <Col
      id={`draggale-${appId}`}
      style={style}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <AppIcon appId={appId} size={size} onClick={onClick} />
    </Col>
  )
}

export default DraggableIcon
