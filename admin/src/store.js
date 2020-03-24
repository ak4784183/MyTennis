import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{
      username:''
    }
  },
  mutations: {
    setUserName(state,value){
      state.user.username=value
    }
  },
  actions: {

  }
})
