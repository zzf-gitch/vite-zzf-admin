import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLoggedIn: false
  }),
  
  getters: {
    getUserName: (state) => state.username,
    getLoginStatus: (state) => state.isLoggedIn
  },
  
  actions: {
    login(username) {
      this.username = username
      this.isLoggedIn = true
    },
    logout() {
      this.username = ''
      this.isLoggedIn = false
    }
  }
})