import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllowedRoutes } from 'routing/helpers'
import { toCamelCase } from 'helpers/strings'
import translate from 'translations/translate'
import Icon from 'components/icon'
import Logo from 'styles/logo/logo'
import LogoSmall from 'styles/logo/logoSmall'

import * as Styled from './style'

const Nav = ({ allRoutes }) => {
  const [open, setOpen] = useState(false)
  const openNav = () => setOpen(true)
  const closeNav = () => setOpen(false)

  const onNavTouchStart = (e) => {
    if (!open) {
      e.stopPropagation()
      openNav()
    }
  }

  return (
    <>
      <Styled.Nav
        open={open}
        onMouseEnter={openNav}
        onMouseLeave={closeNav}
        onTouchStart={onNavTouchStart}
      >
        <Styled.LogoWrapper open={open}>
          <Link to="/" onClick={closeNav}>
            {open ? <Logo /> : <LogoSmall />}
          </Link>
        </Styled.LogoWrapper>

        {getAllowedRoutes(allRoutes).map((route) => {
          const routeId = toCamelCase(route.id)
          const NavItemWrapper = open ? Link : React.Fragment
          const additionalProps = open
            ? {
                to: `/${route.id}`,
                onClick: closeNav
              }
            : undefined

          return (
            <NavItemWrapper key={route.id} {...additionalProps}>
              <Styled.NavItem open={open}>
                <Icon name={routeId} size="medium" />
                {open && <Styled.NavLabel>{translate(`navItem.label.${routeId}`)}</Styled.NavLabel>}
              </Styled.NavItem>
            </NavItemWrapper>
          )
        })}
      </Styled.Nav>

      {open && <Styled.Shadow onClick={closeNav} />}
      {/* <Styled.TrobleShort>
        <Icon name="infos" size="small" />
        <span style={{ paddingLeft: '5px;' }}>{translate('dashboard.troubleshooting')}</span>
      </Styled.TrobleShort> */}
    </>
  )
}

export default Nav
