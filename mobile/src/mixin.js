import moment from "moment";
moment.locale('zh-cn');
import { format } from 'timeago.js';
import router from './router'
import http from './https.js'
import { Indicator } from 'mint-ui';
import { Toast } from "mint-ui";
import store from './store'
const MIXIN={
    data() {
        return {
          defaultHeader: require("./assets/img/default_header.png"),
          default_img: require("./assets/img/default_null.png"),
        }
    },
    filters: {
        formatBirth(dateStr){
          let calc = moment(dateStr).fromNow();
          let age=parseInt(calc,10);         
          if(isNaN(age)){
            age='未知'
          }
          return age    
        },
        formatDM(dateStr){
          let newDateStr = moment(dateStr).format("hh:mm");
          return newDateStr
          
        },
        formatMD(dateStr) {
          if(dateStr){
            let newDateStr = moment(dateStr).format("MM-DD");
            return newDateStr;
          }else{
            return ''
          }        
        },
        formatMDcn(dateStr) {
          if(dateStr){
            let newDateStr = moment(dateStr).format("MMMDo");
            return newDateStr;
          }else{
            return ''
          }        
        },
        formatWK(dateStr){
          let newDateStr = moment(dateStr).day();
          let num=Number(newDateStr);
          if(num==0){
          return '天'
          }else if(num==1){
            return '一'
          }else if(num==2){
            return '二'
          }else if(num==3){
            return '三'
          }else if(num==4){
            return '四'
          }else if(num==5){
            return '五'
          }else{
            return '六'
          }
        },
        formatDay(dateStr) {
          if(dateStr){
            let newDateStr = moment(dateStr).format("YYYY-MM-DD");
            return newDateStr;
          }else{
            return ''
          }
          
        },
        formatDate(dateStr){
          let newDateStr = moment(dateStr).format("YYYY-MM-DD hh:mm");
          return newDateStr;
        },
        formatYear(dateStr){
          let newDateStr = moment(dateStr).format("YYYY");
          return newDateStr;
        },
        timeAgo(dateStr){    
          let time = new Date(dateStr)
          return format(time, 'zh_CN');
        },
        formatReads(num){
          if(num===undefined){
            return 0;
          }else{
            let bit=num.toString().length;
            let arr=num.toString().split('');
            if(bit===5){
              return arr[0]+'.'+arr[1]+'万';
            }else if(bit===6){
              return arr[0]+arr[1]+'.'+arr[2]+'万';
            }else if(bit===7){
              return arr[0]+arr[1]+arr[2]+'.'+arr[3]+'万';
            }else if(bit===8){
              return arr[0]+arr[1]+arr[2]+arr[3]+'万';
            }else if(bit===9){
              return arr[0]+'.'+arr[1]+'亿';
            }else{
              return num;
            }
          }        
        },
        IsFabulous(arr){         
          let id=store.getters.getUserId;       
          let flag='text-grey';
          if(!arr){
            return flag
          }else{
            Object.keys(arr).forEach(key=>{
              if(arr[key]['user']==id){
                flag='text-tomato';
               }
              })  
            return flag
          }
          
        },
        shieldText(val){
          return `${val.substring(0,2)}******${val.substring(val.length-2)}`
        }
      },
    methods: {          
      setAutoHeader(){
        return {
          Autorization:'Bearer '+localStorage.getItem('token')
        }
      },
      routeByName(name,id=null){
        if(name&&id){
          router.push({
            name,
            params:{
              id:id
            }
          })
        }else{ 
          router.push({
            name
          })
        }        
      },
      routeBack(){
        router.back()
      },
      async fetch(url,obj=null){
        if(url&&obj){  
          const res=await http({
            method:'GET',
            url:url,
            params:obj
          })
          return res.data;
        }else{
          const res=await http({
            method:'GET',
            url:url
          })
          return res.data;
        }
        
      },
      async post(url,obj={}){
        const res=await this.$http.post(url,obj);
        return res.data;
      },
      async put(url,obj={}){
        const res=await this.$http.put(url,obj);
        return res.data
      }, 
      async loadMore(option, fetchMethod, list=[], activeIndex=0, flagIndex=0) {
        //防止同一页面下的两个下拉刷新组件冲突
        if (option.noMore|| activeIndex !== flagIndex) {  
          return;
        } else {  
          option.page += 1;
          option.loading = true;
          const temp = await fetchMethod();
          setTimeout(() => {
            let len = temp.length;
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                list.push(temp[i]);
              }
              option.loading = false;
            } else {
              option.loading = false;
              option.noMore = true;
            }
          }, 1500);
        }
      },
      // 加载loading提示
      IndicatorOpen(text){
        Indicator.open({
          text: text,
          spinnerType: 'fading-circle'
        });
      },
      IndicatorClose(){
          Indicator.close();
      },
      AlertSuccess(text='操作成功',icon){
        Toast({
          message: text,
          iconClass: icon?"iconfont"+" "+icon:"iconfont icon-xiaoxi-chenggong",//设置默认提示logo
          duration: 1500
        });
      },
      AlertError(text='操作失败'){
        Toast({
          message: text,
          iconClass: 'iconfont icon-cuowu',
          duration: 1500
        });
      },
      async setFabulous(item,doc_name) { //点赞提交      
        const {id}=JSON.parse(localStorage.getItem('m_userInfo'));
        if (item&&id) {
          const temp = {
            from: item,
            user: id
          }; 
          await this.post(`rest/${doc_name}/fabulous`, temp);  
        }
      },
      // 收藏
      async setCollection(id,doc_name) {          
      // 接受一个收藏的参数和提交的收藏路由字段    
        if (id && this.getUserId) {         
          const res= await this.post(`rest/${doc_name}/collect`, {
            collect:id,
            user: this.getUserId
          });     
          this.AlertSuccess(res.message);
        }
      },
      // 增加播放量或者阅读量
      async setReads(url){
        const {reads}=await this.put(url);
        return reads
      },
      removeActionSheet(id,option) {
        option.state = true;
        option.target = id;
      },
    },
}
export default MIXIN