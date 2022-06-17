import { useCallback, useEffect, useMemo } from 'react'
import { account } from '@senswap/sen-js'
import Joyride, { CallBackProps, EVENTS, STATUS } from 'react-joyride'

import Tooltip from './tooltip'

import {
  useRootSelector,
  RootState,
  useRootDispatch,
  RootDispatch,
} from 'os/store'

import { DEFAULT_STEPS, NEWCOMER_STEPS } from './steps'
import { setWalkthrough, WalkThroughType } from 'os/store/walkthrough.reducer'
import './index.os.less'

const Walkthrough = () => {
  const dispatch = useRootDispatch<RootDispatch>()
  const walletAddress = useRootSelector(
    (state: RootState) => state.wallet.address,
  )
  const type = useRootSelector((state: RootState) => state.walkthrough.type)
  const run = useRootSelector((state: RootState) => state.walkthrough.run)
  const step = useRootSelector((state: RootState) => state.walkthrough.step)
  const visited = useRootSelector((state: RootState) => state.flags.visited)

  const onCallback = async ({
    type,
    status,
    step: { target },
  }: CallBackProps) => {
    const options: string[] = [STATUS.FINISHED, STATUS.SKIPPED]
    if (options.includes(status))
      return dispatch(setWalkthrough({ run: false }))
    if ((EVENTS.TARGET_NOT_FOUND as string) === type) {
      await dispatch(setWalkthrough({ run: false }))
      const intervalId = setInterval(() => {
        const element = document.querySelector(target as string)
        const { x } = element?.getBoundingClientRect() || { x: -1 }
        // Make sure that there exits a target in the view port horizontally
        if (x > 0 && x < window.innerWidth) {
          clearInterval(intervalId)
          return dispatch(setWalkthrough({ run: true }))
        }
      }, 500)
    }
  }

  const steps = useMemo(() => {
    if (type === WalkThroughType.NewComer) return NEWCOMER_STEPS
    return DEFAULT_STEPS
  }, [type])

  const initWalkthrough = useCallback(async () => {
    if (!account.isAddress(walletAddress)) return
    if (!visited)
      return dispatch(
        setWalkthrough({ type: WalkThroughType.NewComer, run: true }),
      )
  }, [dispatch, walletAddress, visited])

  useEffect(() => {
    initWalkthrough()
  }, [initWalkthrough])

  return (
    <Joyride
      continuous={true}
      run={run}
      steps={steps}
      stepIndex={step}
      scrollOffset={128}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      callback={onCallback}
      tooltipComponent={Tooltip}
    />
  )
}

export default Walkthrough
