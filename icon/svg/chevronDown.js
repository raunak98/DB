import React from 'react'

const SVG = ({ themes }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.25 7.5L9 11.25L12.75 7.5H5.25Z" fill={themes === 'dark' ? '#F2F3F4' : '#333'} />
  </svg>
)

export default SVG
