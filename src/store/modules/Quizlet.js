import { wsBaseURL } from '@/api/api.config'
import Api from '@/api/api'

export default {
  namespaced: true,
  state: {
    quizzes: null,
    createdQuiz: null,
    attemptToReconnect: 0
  },
  getters: {},
  mutations: {
    // Actions for quiz
    initCreatedQuiz (state) {
      state.createdQuiz = {
        introductionText: '',
        duration: '',
        logoURL: '',
        section: '',
        bgColor: '',
        questions: []
      }
    },
    updateCreatedQuiz (state, { value, key }) {
      state.createdQuiz[key] = value
    },
    addQuestion (state) {
      state.createdQuiz.questions.push({
        question: '',
        answers: []
      })
    },
    deleteQuestion (state, index) {
      state.createdQuiz.questions.splice(index, 1)
    },
    updateQuestion (state, { index, value }) {
      state.createdQuiz.questions[index].question = value
    },
    addAnswer (state, questionIndex) {
      state.createdQuiz.questions[questionIndex].answers.push({
        value: '',
        isRightAnswer: false
      })
    },
    deleteAnswer (state, { questionIndex, answerIndex }) {
      state.createdQuiz.questions[questionIndex].answers.splice(answerIndex, 1)
    },
    updateAnswer (state, { questionIndex, answerIndex, value }) {
      state.createdQuiz.questions[questionIndex].answers[answerIndex].value = value
    },
    // Get quizzes
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
    },
    async uploadFile ({ commit }, file) {
      return await Api.post('quizlet/upload', {
        data: file
      }).then(res => res.file)
    }
  }
}
