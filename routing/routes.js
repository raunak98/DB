import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import * as Pages from 'pages'
import { toPascalCase } from 'helpers/strings'
import { getAllowedRoutes, getAllRoutesPaths } from './helpers'

const filterAllowedRoutes = (allRoutes = [], initialValue = [], parentPath = '') => {
  const allowedRoutes = initialValue

  // filter the allowed routes that the authenticated user can access based on his roles
  const filteredRoutes = getAllowedRoutes(allRoutes)

  // iterate through the allowed routes and recursively through their allowed children routes
  // to map each path to its React component
  filteredRoutes.forEach((allowedRoute) => {
    const path = allowedRoute.multiple ? `${parentPath}/:id` : `${parentPath}/${allowedRoute.id}`

    // A parent level in the permissions matrix might or might not have a landing page to display.
    // Only its children might be mapped to UI pages, so we call it implicit parent.
    // We only create Routes for parents that have landing pages
    if (!allowedRoute.implicitParent) {
      const pageName = toPascalCase(allowedRoute.id)
      const Page = Pages[pageName]

      allowedRoutes.push(
        <Route
          key={`${allowedRoute.id}-route`}
          exact
          path={path}
          render={() => (Page ? <Page /> : <Redirect to="/404" />)}
        />
      )
    }

    if (allowedRoute.children.length) {
      filterAllowedRoutes(allowedRoute.children, allowedRoutes, path)
    }
  })

  return allowedRoutes
}

const Routes = ({ allRoutes }) => {
  const allowedRoutes = filterAllowedRoutes(allRoutes)
  const notAuthorisedRoute = (
    <Route key="not-authorised-route" path="/403" component={Pages.NotAuthorised} />
  )
  const errorPageRoute = <Route key="error" path="/error" component={Pages.Error} />
  const notFoundRoute = <Route key="not-found-route" path="/404" component={Pages.NotFound} />
  const fallbackRoute = (
    <Route
      key="fallback-route"
      render={({ location }) => {
        // if a path exists in the matrix of all routes but was not among the allowed routes,
        // then the authenticated user is not authorised to access this path.
        // Hence, redirect to Page not authorised,
        // otherwise redirect to Page not found
        const currentPath = location.pathname
        const allPaths = getAllRoutesPaths(allRoutes)
        const pathFound = allPaths.find((path) => {
          // if the path has a dynamic parameter /:id, then remove the parameter before comparing
          const paramIndex = path.indexOf(':')
          if (paramIndex === -1) {
            return path === currentPath
          }
          const staticPath = path.substring(0, paramIndex)
          const currentStaticPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1)
          return staticPath === currentStaticPath
        })

        return pathFound ? <Redirect to="/403" /> : <Redirect to="/404" />
      }}
    />
  )

  const dashboard = <Route key="home-route" exact path="/" component={Pages.Dashboard} />

  const routes = [
    dashboard,
    ...allowedRoutes,
    notAuthorisedRoute,
    notFoundRoute,
    errorPageRoute,
    fallbackRoute
  ]

  return <Switch>{routes}</Switch>
}

export default Routes
