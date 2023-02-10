import { defineStore } from 'pinia'
import cookies from '../lib/cookies'

export default defineStore('users', {
  state: () => {
    return {
      info: null,
      token: null
    }
  },
  actions: {
    logout () {
      this.info = null
      this.token = null
      localStorage.removeItem('token')
      cookies.removeItem('token')
    },
    setInfo (info) {
      this.info = info
    },
    setToken (token, remember) {
      if (remember) {
        localStorage.setItem('token', token)
      } else {
        cookies.setItem('token', token)
      }
      this.token = token
    }
  }
})