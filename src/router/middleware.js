import store from '../store'

export function checkAuth (to, from, next) {
  if (to.matched.some(record => record.meta.isProtected)) {
    if (store.getters['Auth/isLogged']) {
      return next()
    }

    return next('/auth')
  }

  return next()
}
