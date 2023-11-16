const USER_ROLES = ['END_USER', 'CENTRAL_ID_ADMIN']

// filter the allowed routes that the authenticated user can access based on his roles
export const getAllowedRoutes = (allRoutes = []) =>
  allRoutes.filter(
    (route) =>
      route.implicitParent ||
      route.allowedRoles.find((allowedRole) => USER_ROLES.includes(allowedRole))
  )

// iterate through all routes and recursively through their children routes
// to collect all their ids which are used as url paths
export const getAllRoutesPaths = (allRoutes = [], initialValue = [], parentPath = '') => {
  const allRoutesIds = initialValue

  allRoutes.forEach((route) => {
    let path = `${parentPath}/${route.id}`
    path += route.multiple ? '/:id' : ''

    if (!route.implicitParent) {
      allRoutesIds.push(path)
    }
    if (route.children.length) {
      getAllRoutesPaths(route.children, allRoutesIds, path)
    }
  })

  return allRoutesIds
}
