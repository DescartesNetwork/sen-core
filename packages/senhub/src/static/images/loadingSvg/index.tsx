import { CSSProperties } from 'react'

import './index.os.less'

export type IconLoadingProps = {
  style?: CSSProperties
  width?: CSSProperties['width']
}
const IconLoading = ({ style, width = 75 }: IconLoadingProps) => {
  return (
    <svg
      style={{ width, ...style }}
      id="e60rItJNCqy1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 147 180"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        <linearGradient
          id="e60rItJNCqy3-fill"
          x1="110.721"
          y1="89.9958"
          x2="-0.018019"
          y2="89.9958"
          spreadMethod="pad"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 0)"
        >
          <stop id="e60rItJNCqy3-fill-0" offset="0%" stopColor="#f9575e" />
          <stop id="e60rItJNCqy3-fill-1" offset="27%" stopColor="#f8555b" />
          <stop id="e60rItJNCqy3-fill-2" offset="49%" stopColor="#f44f51" />
          <stop id="e60rItJNCqy3-fill-3" offset="68%" stopColor="#ee4540" />
          <stop id="e60rItJNCqy3-fill-4" offset="87%" stopColor="#e63728" />
          <stop id="e60rItJNCqy3-fill-5" offset="100%" stopColor="#de2a13" />
        </linearGradient>
        <linearGradient
          id="e60rItJNCqy4-fill"
          x1="-332122"
          y1="278448"
          x2="-335093"
          y2="277720"
          spreadMethod="pad"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0 0)"
        >
          <stop id="e60rItJNCqy4-fill-0" offset="0%" stopColor="#f9575e" />
          <stop id="e60rItJNCqy4-fill-1" offset="27%" stopColor="#f8555b" />
          <stop id="e60rItJNCqy4-fill-2" offset="49%" stopColor="#f44f51" />
          <stop id="e60rItJNCqy4-fill-3" offset="68%" stopColor="#ee4540" />
          <stop id="e60rItJNCqy4-fill-4" offset="87%" stopColor="#e63728" />
          <stop id="e60rItJNCqy4-fill-5" offset="100%" stopColor="#de2a13" />
        </linearGradient>
      </defs>
      <g mask="url(#e60rItJNCqy5)">
        <path
          d="M73.183,179.941L24.3731,131.048C8.76725,115.416,0,94.214,0,72.1061C0,49.9989,8.76725,28.7969,24.3731,13.1645L37.492,0.023438L86.3297,48.9438C101.923,64.5787,110.68,85.7765,110.675,107.878c-.005,22.1-8.772,43.294-24.3729,58.921L73.183,179.941Z"
          fill="url(#e60rItJNCqy3-fill)"
        />
        <path
          d="M60.0697,48.9479L108.935,0l13.119,13.1411c7.735,7.7414,13.871,16.9339,18.058,27.0523s6.342,20.9639,6.342,31.9172c0,10.9532-2.155,21.7988-6.342,31.9174-4.187,10.118-10.323,19.31-18.058,27.052L73.2158,180L60.0697,166.832c-15.6059-15.633-24.3732-36.835-24.3732-58.942c0-22.1079,8.7673-43.3098,24.3732-58.9421Z"
          fill="url(#e60rItJNCqy4-fill)"
        />
        <mask id="e60rItJNCqy5" mask-type="luminance">
          <g id="e60rItJNCqy6_to" transform="translate(-341.355363,225.51909)">
            <path
              d="M-60.823858,179.941q19.025124-21.734583,44.391955,0t40.805002,0q18.174543-18.693805,40.051771,1.124032q21.877228,21.403264,44.510128-1.124034q22.870517-22.657371,42.688354,1.124033t42.013814-.000001q22.195979-29.330398,48.355523-.792713t46.770094-.331321q20.610548-26.490864,45.97738,0t45.184668,1.124033q18.23241-24.444043,38.050247-1.124033t42.013814,0q22.195978-23.450084,41.221101.33132t14.757885,263.845732h-823.732642L-60.823858,179.941Z"
              transform="rotate(-359.999996) scale(1.195849,0.774825) translate(-150.129384,-239.432575)"
              fill="#f5e6e6"
              strokeWidth="0.5"
            />
          </g>
        </mask>
      </g>
      <ellipse
        rx="41.817783"
        ry="41.817783"
        transform="matrix(-1 0 0 1 67.796121-137.08376)"
        fill="#fff"
        strokeWidth="0"
      />
    </svg>
  )
}

export default IconLoading
