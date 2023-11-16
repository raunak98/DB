import React from 'react'

const LogoSmall = () => (
  <svg width="33px" height="32px" viewBox="0 0 33 32" version="1.1">
    <defs>
      <filter colorInterpolationFilters="auto" id="filter-1">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.000000 0 0 0 0 0.094118 0 0 0 0 0.658824 0 0 0 1.000000 0"
        />
      </filter>
    </defs>
    <g id="Screens" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Group" transform="translate(-16.000000, -24.000000)" filter="url(#filter-1)">
        <g transform="translate(16.500000, 24.000000)">
          <path
            d="M0,0 L32,0 L32,32 L0,32 L0,0 Z M4.54054054,4.54054054 L4.54054054,27.6756757 L27.6756757,27.6756757 L27.6756757,4.54054054 L4.54054054,4.54054054 Z M19.2432432,7.78378378 L25.0810811,7.78378378 L12.972973,24.4324324 L7.13513514,24.4324324 L19.2432432,7.78378378 Z"
            id="Shape"
            fill="#0018A8"
          />
        </g>
      </g>
    </g>
  </svg>
)

export default LogoSmall
