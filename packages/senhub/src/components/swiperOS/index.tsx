import { ReactNode, useMemo } from 'react'

import { Swiper } from 'swiper/react'
import { Navigation, SwiperOptions } from 'swiper'

import { useRootSelector, RootState } from 'store'

import 'swiper/css/bundle'
import './index.os.less'

export const SwiperOs = ({
  children,
  ...rest
}: { children: ReactNode } & SwiperOptions) => {
  const infix = useRootSelector((state: RootState) => state.ui.infix)
  const isMobile = useMemo(() => infix === 'xs', [infix])

  return (
    <Swiper
      slidesPerView={'auto'}
      lazy
      spaceBetween={24}
      modules={isMobile ? [] : [Navigation]}
      navigation={!isMobile}
      {...rest}
    >
      {children}
    </Swiper>
  )
}
