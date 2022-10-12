import { ReactNode } from 'react'
import { DragOverlay } from '@dnd-kit/core'

import {
  DropAnimationSideEffectsParameters,
  KeyframeResolverParameters,
} from '@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation'
import { CSS } from '@dnd-kit/utilities'

export type DraggableOverlayProps = { children?: ReactNode }
const DraggableOverlay = ({ children }: DraggableOverlayProps) => {
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
      {children}
    </DragOverlay>
  )
}

export default DraggableOverlay
