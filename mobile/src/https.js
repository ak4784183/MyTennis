
import axios from 'axios'
import { Toast } from "mint-ui";
import router from './router'
import store from './store'
const http=axios.create({
    timeout: 6000,
    baseURL:process.env.VUE_APP_API_URL||'/mobile/api'
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
    if(err.message.includes('timeout')){   // 判断请求异常信息中是否含有超时timeout字符串
      store.state.preventClick=false;
      Toast({
        message: `请求超时，请稍后再试`,
        iconClass: "iconfont icon-cuowu",
        duration: 1000
      });         
    }
    return Promise.reject(err); 
})
export default http;