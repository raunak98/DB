import React from 'react'
import theme from 'styles/theme'

const SVG = ({ size }) => (
  <svg width={theme.icons[size]} height={theme.icons[size]} viewBox="0 0 40 40" version="1.1">
    <defs>
      <rect id="path-1" x="0" y="0" width="24" height="24" />
    </defs>
    <g id="Library" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Icons" transform="translate(-100.000000, -456.000000)">
        <g id="Icons-/-Create-/-40px" transform="translate(100.000000, 456.000000)">
          <circle id="Oval" stroke="currentColor" cx="20" cy="20" r="19.5" />
          <g id="plus-thin" transform="translate(8.000000, 8.000000)">
            <mask id="mask-2" fill="white">
              <use xlinkHref="#path-1" />
            </mask>
            <g id="Mask" />
            <path
              d="M18.5,11.5 L12.5,11.5 L12.5,5.5 C12.5,5.2 12.3,5 12,5 C11.7,5 11.5,5.2 11.5,5.5 L11.5,11.5 L5.5,11.5 C5.2,11.5 5,11.7 5,12 C5,12.3 5.2,12.5 5.5,12.5 L11.5,12.5 L11.5,18.5 C11.5,18.8 11.7,19 12,19 C12.3,19 12.5,18.8 12.5,18.5 L12.5,12.5 L18.5,12.5 C18.8,12.5 19,12.3 19,12 C19,11.7 18.8,11.5 18.5,11.5 Z"
              id="Color"
              fill="currentColor"
              mask="url(#mask-2)"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
)

export default SVG
