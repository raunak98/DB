import React from 'react'
import theme from 'styles/theme'

const SVG = ({ size, themes }) => (
  <svg width={theme.icons[size]} height={theme.icons[size]} viewBox="-7 -7 32 33" version="1.1">
    <path
      d="M9.2 11.9004C9.7 11.9004 10.2 11.8004 10.7 11.6004C11.1 11.4004 11.4 11.2004 11.7 10.9004C11.7 10.9004 11.7 10.9004 11.8 10.8004C12.5 10.1004 13 9.20039 13 8.10039C13 7.00039 12.6 6.10039 11.8 5.40039C11.5 5.10039 11.1 4.90039 10.8 4.70039C10.3 4.50039 9.8 4.40039 9.3 4.40039C7.2 4.40039 5.5 6.10039 5.5 8.20039C5.5 10.2004 7.2 11.9004 9.2 11.9004ZM9.2 5.40039C9.3 5.40039 9.5 5.40039 9.6 5.40039C10 5.50039 10.4 5.60039 10.7 5.80039C11.5 6.30039 12 7.20039 12 8.20039C12 9.20039 11.5 10.0004 10.8 10.5004C10.8 10.5004 10.8 10.5004 10.7 10.5004C10.4 10.7004 10.1 10.8004 9.7 10.9004C9.6 10.9004 9.4 10.9004 9.3 10.9004C7.8 10.9004 6.5 9.70039 6.5 8.10039C6.5 6.50039 7.7 5.40039 9.2 5.40039Z"
      fill={themes === 'dark' ? '#FFFFFF' : '#333333'}
    />
    <path
      d="M13.3 5.60039C14.3 6.00039 15 7.00039 15 8.20039C15 9.40039 14.3 10.4004 13.3 10.8004C13 11.3004 12.6 11.7004 12.2 12.0004H12.3C14.4 12.0004 16.1 10.3004 16.1 8.20039C16.1 6.10039 14.4 4.40039 12.3 4.40039H12.2C12.6 4.70039 13 5.10039 13.3 5.60039Z"
      fill={themes === 'dark' ? '#FFFFFF' : '#333333'}
    />
    <path
      d="M14.9 14.1004C14 13.5004 12.7 13.1004 10.7 13.0004C10.2 13.0004 9.7 12.9004 9.2 12.9004C3.7 12.9004 2 14.9004 2 16.7004V18.9004H16.5V16.7004C16.5 15.8004 16.1 14.8004 14.9 14.1004ZM15.5 17.9004H3V16.7004C3 16.2004 3.2 15.6004 4.1 15.0004C4.6 14.7004 5.5 14.3004 6.6 14.1004H6.7C7.4 14.0004 8.3 13.9004 9.3 13.9004C9.8 13.9004 10.3 13.9004 10.8 14.0004C12.6 14.1004 13.7 14.5004 14.4 15.0004C15.3 15.6004 15.5 16.2004 15.5 16.7004V17.9004Z"
      fill={themes === 'dark' ? '#FFFFFF' : '#333333'}
    />
    <path
      d="M15.3 13.2004C15.4 13.2004 15.4 13.3004 15.5 13.3004C16.1 13.7004 16.6 14.2004 17 14.7004C17.2 14.8004 17.3 14.9004 17.5 15.0004C18.4 15.6004 18.6 16.2004 18.6 16.7004V17.9004H17.6V18.9004H19.6V16.7004C19.5 15.3004 18.4 13.7004 15.3 13.2004Z"
      fill={themes === 'dark' ? '#FFFFFF' : '#333333'}
    />
    <path
      d="M24.0338 10.0369L24.074 10L24.0338 9.96319L23.6873 9.64537L23.6871 9.64518L20.7304 6.96297L20.6967 6.93241L20.6631 6.96306L19.9663 7.59869L19.9257 7.63573L19.9664 7.67266L22.5319 10L19.9664 12.3273L19.9257 12.3643L19.9663 12.4013L20.6631 13.0369L20.6967 13.0676L20.7304 13.037L23.6871 10.3548L23.6873 10.3546L24.0338 10.0369Z"
      fill={themes === 'dark' ? '#FFFFFF' : '#333333'}
    />
  </svg>
)

export default SVG
