import React from 'react'

const SVG = ({ themes }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.75 10.5L9 6.75L5.25 10.5L12.75 10.5Z"
      fill={themes === 'dark' ? '#F2F3F4' : '#333'}
    />
  </svg>
)

export default SVG
