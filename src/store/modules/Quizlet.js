import { wsBaseURL } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    quizzes: null,
    attemptToReconnect: 0
  },
  getters: {},
  mutations: {
    setQuizzes (state, payload) {
      state.quizzes = payload
    },
    increaseAttempt (state) {
      ++state.attemptToReconnect
    }
  },
  actions: {
    getQuizzes ({ dispatch, commit, state, rootState }) {
      const { Auth: { token } } = rootState
      const webSocketOpen = (() => {
        return new WebSocket(`${wsBaseURL}/quizlet/get/all`)
      })()
      const webSocketSendData = message => {
        webSocketWaitConnection(function () {
          webSocketOpen.send(message)
        }, 1000)
      }
      const webSocketWaitConnection = (callback, interval) => {
        if (webSocketOpen.readyState === 1) {
          callback()
        } else {
          setTimeout(() => {
            webSocketWaitConnection(callback, interval)
          }, interval)
        }
      }

      webSocketWaitConnection(function () {
        webSocketSendData(token)
      }, 1000)

      webSocketOpen.onmessage = event => {
        commit('setQuizzes', JSON.parse(event.data))
      }

      webSocketOpen.onclose = event => {
        console.log('Socket is closed. Reconnect well be in 1 second', event.reason)

        if (state.attemptToReconnect < 5) {
          setTimeout(() => {
            commit('increaseAttempt')
            dispatch('getQuizzes')
          }, 1000)
        }
      }

      webSocketOpen.onerror = error => {
        console.error('Socket encountered error: ', error, 'Closing socket')
        console.error('Socket encountered error: ', error, 'Reconnect well be in 1 second')
        webSocketOpen.close()

        if (state.attemptToReconnect < 5) {
          setTimeout(() => {
            commit('increaseAttempt')
            dispatch('getQuizzes')
          }, 1000)
        }
      }
    }
  }
}
