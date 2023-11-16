import React from 'react'

const SVG = ({ themes }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.7031 17.2971L9.41603 12L14.7031 6.70289L14.0002 6L8.00023 12L14.0002 18L14.7031 17.2971Z"
      fill={themes === 'dark' ? '#F2F3F4' : '#333'}
    />
  </svg>
)

export default SVG
