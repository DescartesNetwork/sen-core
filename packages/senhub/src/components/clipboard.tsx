import { MouseEvent, useCallback, useState } from 'react'
import copy from 'copy-to-clipboard'

import { Tooltip, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { asyncWait } from 'shared/util'

export type ClipboardProps = { content: string }

const Clipboard = ({ content }: ClipboardProps) => {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(
    async (text: string, e: MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      copy(text)
      setCopied(true)
      await asyncWait(1500)
      return setCopied(false)
    },
    [],
  )

  return (
    <Tooltip title="Copied" open={copied}>
      <Button
        type="text"
        size="small"
        onClick={(e) => onCopy(content, e)}
        icon={<IonIcon name="copy-outline" />}
      />
    </Tooltip>
  )
}

export default Clipboard
