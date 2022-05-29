import Api from '@/api/api'

export default {
  namespaced: true,
  state: {
    token: null,
    refreshToken: null
  },
  getters: {
    isLogged (state) {
      return Boolean(state.token)
    }
  },
  mutations: {
    setToken (state, { accessToken, refreshToken }) {
      state.token = accessToken
      state.refreshToken = refreshToken

      localStorage.setItem('werialToken', JSON.stringify({
        accessToken,
        refreshToken
      }))
    }
  },
  actions: {
    async login ({ commit }, { username, password }) {
      if (!(username && password)) return null

      return await Api.post('/login', {
        data: {
          username,
          password
        }
      })
    },
    async checkToken () {
      return await Api.get('/checkToken')
    }
  }
}
