import React from 'react'
import logodark from '../../config/logo_square_white.png'
import logolight from '../../config/logo_square_rgb.png'

const BrandLogo = ({ themes, openDrawer }) => (
  <div style={{ display: 'flex', flexDirection: 'row', height: '50px', marginTop: '10px' }}>
    <svg width="100" height="25" viewBox="0 0 93 25" version="1.1">
      <image
        width="24"
        height="24"
        xlinkHref={themes === 'dark' ? logodark : logolight}
        alt="logo"
      />
    </svg>
    {openDrawer && <p style={{ margin: '0 0 0 -55px', fontSize: '15px' }}>Accessio</p>}
  </div>
)

export default BrandLogo
