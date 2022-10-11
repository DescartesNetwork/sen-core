import { Fragment } from 'react'
import { DragOverlay } from '@dnd-kit/core'

import AppIcon from 'components/appIcon'
import { Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import {
  DropAnimationSideEffectsParameters,
  KeyframeResolverParameters,
} from '@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation'
import { CSS } from '@dnd-kit/utilities'

export type DraggableOverlayProps = { activeId: string; size?: number }
const DraggableOverlay = ({ activeId, size = 32 }: DraggableOverlayProps) => {
  if (!activeId) return <Fragment />

  const keyframesConfigs = ({ transform }: KeyframeResolverParameters) => {
    return [
      { transform: CSS.Transform.toString(transform.initial) },
      {
        transform: CSS.Transform.toString({
          ...transform.final,
          scaleX: 0.94,
          scaleY: 0.94,
        }),
      },
    ]
  }

  const sideEffectConfigs = ({
    active,
    dragOverlay,
  }: DropAnimationSideEffectsParameters) => {
    active.node.style.opacity = '0'
    const button = dragOverlay.node.querySelector('button')
    if (button) {
      button.animate(
        [
          {
            boxShadow:
              '-1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)',
          },
          {
            boxShadow:
              '-1px 0 15px 0 rgba(34, 33, 81, 0), 0px 15px 15px 0 rgba(34, 33, 81, 0)',
          },
        ],
        {
          duration: 250,
          easing: 'ease',
          fill: 'forwards',
        },
      )
    }
    return () => {
      active.node.style.opacity = ''
    }
  }

  return (
    <DragOverlay
      dropAnimation={{
        sideEffects: sideEffectConfigs,
        keyframes: keyframesConfigs,
      }}
    >
      <div className="card-draggable-item" id={`draggale-${activeId}`}>
        <AppIcon appId={activeId} size={size} direction="horizontal" />
        <Button
          type="text"
          icon={<IonIcon name="menu-outline" />}
          onClick={() => {}}
        />
      </div>
    </DragOverlay>
  )
}

export default DraggableOverlay
