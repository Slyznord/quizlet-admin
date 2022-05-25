import { createStore } from 'vuex'

import Auth from './modules/Auth'
import Quizlet from './modules/Quizlet'

export default createStore({
  modules: {
    Auth,
    Quizlet
  }
})
