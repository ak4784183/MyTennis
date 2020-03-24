
import axios from 'axios'
import { Toast } from "mint-ui";
import router from './router'
import store from './store'
const http=axios.create({
    baseURL:'http://localhost:3000/mobile/api/'
})
http.interceptors.request.use(config=>{
  store.state.preventClick=true;
  const token=localStorage.getItem('m_token');
    if(token){
      config.headers.Autorization='Bearer '+token;
    }
    return config
  },err=>{
    return Promise.reject(err)
  })

http.interceptors.response.use(res=>{
    store.state.preventClick=false;
    return res
},err=>{
    if(err.response.data.message){
        store.state.preventClick=false;      //重置二次提交状态
        Toast({
            message: err.response.data.message,
            iconClass: "iconfont icon-cuowu",
            duration: 1000
          });    
    }
    
    if(err.response.status==401){      
        router.push({
            name:'login'
        })
    }
})
export default http;