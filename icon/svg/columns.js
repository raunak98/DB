import React from 'react'
import theme from 'styles/theme'

const SVG = ({ size }) => (
  <svg width={theme.icons[size]} height={theme.icons[size]} viewBox="0 0 24 24" version="1.1">
    <defs>
      <filter colorInterpolationFilters="auto" id="filter-1">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.062745 0 0 0 0 0.423529 0 0 0 0 0.666667 0 0 0 1.000000 0"
        />
      </filter>
    </defs>
    <g id="Library" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="Icons-/-Manage-Columns-/-24-px"
        transform="translate(-240.000000, -241.000000)"
        filter="currentColor"
      >
        <g transform="translate(240.000000, 241.000000)">
          <path
            d="M5.625,0.375 L5.625,23.625 L0.375,23.625 L0.375,0.375 L5.625,0.375 Z M14.625,0.375 L14.625,23.625 L9.375,23.625 L9.375,0.375 L14.625,0.375 Z M23.625,0.375 L23.625,23.625 L18.375,23.625 L18.375,0.375 L23.625,0.375 Z M4.875,1.125 L1.125,1.125 L1.125,22.875 L4.875,22.875 L4.875,1.125 Z M13.875,1.125 L10.125,1.125 L10.125,22.875 L13.875,22.875 L13.875,1.125 Z M22.875,1.125 L19.125,1.125 L19.125,22.875 L22.875,22.875 L22.875,1.125 Z"
            id="Combined-Shape"
            fill="currentColor"
          />
        </g>
      </g>
    </g>
  </svg>
)

export default SVG
