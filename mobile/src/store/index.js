import Vue from 'vue'
import Vuex from 'vuex'
// import router from '../router/index'
import http from '../https'
import getters from './getters';
Vue.use(Vuex)
const state={
  stateOptions:{
    mask_state:false, 
  },
  preventClick:false,                  //防止二次提交
  tabbarIndex:0,                       //遮罩层状态
  article:{                            //首页周边轮播图的点击索引
    category_index:0,
    catType_index:0
  },
  post:{
    commend_drawer_state:false,
    select_commend_id:null
  },
  local_userInfo:null,                 //本地的用户数据，只含有用户id和昵称
  userInfo:null
};

const mutations={
  setItem(state,payload){     
    window.localStorage.setItem(payload.key,JSON.stringify(payload.value));
  },
  removeItem(state,key){
    window.localStorage.removeItem(key);
  },
  switchMaskState(state){
    state.maskState=!state.maskState;
  },
  async getUserInfo(state){    
    const res=await http.get(`/rest/user/${getters.getUserId(state)}`);
    state.userInfo=res.data;
  },
};

const actions={

};
const modules={
};
const store= new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})
export default store;
