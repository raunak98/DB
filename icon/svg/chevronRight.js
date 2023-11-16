import React from 'react'

const SVG = ({ themes }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.64844 7.05202L13.9355 12.3491L8.64844 17.6462L9.35133 18.3491L15.3513 12.3491L9.35133 6.34912L8.64844 7.05202Z"
      fill={themes === 'dark' ? '#F2F3F4' : '#333'}
    />
  </svg>
)

export default SVG
