import React from 'react'
import theme from 'styles/theme'

const SVG = ({ size, themes }) => (
  <svg width={theme.icons[size]} height={theme.icons[size]} viewBox="0 30 100 20" version="1.1">
    <title>calendar icon</title>
    <g id="Templates" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="noun_calender_160872-(1)"
        fill={themes === 'dark' ? '#FFFFFF' : '#333333'}
        fillRule="nonzero"
      >
        <path
          d="M27,16.5 C27,19 25,21 22.5,21 C20,21 18,19 18,16.5 L18,4.5 C18,2 20,0 22.5,0 C25,0 27,2 27,4.5 L27,16.5 Z M71,4.5 C71,2 69,0 66.5,0 C64,0 62,2 62,4.5 L62,16.5 C62,19 64,21 66.5,21 C69,21 71,19 71,16.5 L71,4.5 Z M90,15.9 L90,85 C90,87.7 87.8,89.9 85,89.9 L5,89.9 C2.2,89.9 0,87.7 0,85 L0,15.9 C0,13.2 2.2,11 5,11 L15,11 L15,16.5 C15,20.8 18.2,24.2 22.5,24.2 C26.8,24.2 30,20.7 30,16.5 L30,11 L59,11 L59,16.5 C59,20.8 62.2,24.2 66.5,24.2 C70.8,24.2 74,20.7 74,16.5 L74,11 L84.9,11 C87.6,11 90,13.2 90,15.9 Z M82,33.9 C82,32.9 81.1,32 80,32 L10,32 C8.9,32 8,32.8 8,33.9 L8,80.1 C8,81.1 8.9,82 10,82 L80,82 C81.1,82 82,81.2 82,80.1 L82,33.9 Z"
          id="calendar-icon"
        />
      </g>
    </g>
  </svg>
)

export default SVG
