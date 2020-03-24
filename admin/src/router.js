import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import Login from './views/Login.vue'
// 文章分类
import CategoryList from './views/CategoryList.vue'
import CategoryEdit from './views/CategoryEdit.vue'

// 文章
import ArticleList from './views/ArticleList.vue'
import ArticleEdit from './views/ArticleEdit.vue'
import ArtCommendList from './views/ArtCommendList.vue'
// 视频
import VideoList from './views/VideoList.vue'
import VideoEdit from './views/VideoEdit.vue'
import VideoCommendList from './views/VideoCommendList.vue'
// 用户
import AdminList from './views/AdminList.vue'
import AdminEdit from './views/AdminEdit.vue'
import UserList from './views/UserList.vue'
import UserData from './views/UserData.vue'

// 装备分类
import EquipTypeList from './views/EquipTypeList.vue'
import EquipTypeEdit from './views/EquipTypeEdit.vue'

// 装备
import ProductList from './views/ProductList.vue'
import ProductEdit from './views/ProductEdit.vue'

// 广告
import AdList from './views/AdList.vue'
import AdEdit from './views/AdEdit.vue'

// 球员
import PlayerList from './views/PlayerList.vue'
import PlayerEdit from './views/PlayerEdit.vue'
// 比赛
import MatchList from './views/MatchList.vue'
import MatchEdit from './views/MatchEdit.vue'
import ContestList from './views/ContestList.vue'
import ContestEdit from './views/ContestEdit.vue'
// 帖子
import PostList from './views/PostList.vue'
import PostDetail from './views/PostDetail.vue'

// 临时数据
import TempList from './views/TempList.vue'

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path:'/login',
      name:"login",
      component:Login,
      meta:{
        isLimit:true
      }
    },
    {
      path:'/',
      name:"",
      redirect:"main"
    },  
    {
      path:'/main',
      name:"main",
      component:Main,
      children:[{
        path:'/category/list',
        name:"categoryList",
        component:CategoryList
      },
      {
        path:'/category/create',
        name:"categoryCreate",
        component:CategoryEdit
      },
      {
        path:'/category/edit/:id',
        name:"categoryEdit",
        component:CategoryEdit,
        props:true
      },
      {
        path:'/article/list',
        name:"articleList",
        component:ArticleList
      },
      {
        path:'/article/create',
        name:"articleCreate",
        component:ArticleEdit
        },
      {
        path:'/article/edit/:id',
        name:"articleEdit",
        component:ArticleEdit,
        props:true
      },
      {
        path:'/article/commend/list',
        name:"articleCommend",
        component:ArtCommendList
      },
      {
        path:'/video/list',
        name:"videoList",
        component:VideoList
      },
      {
        path:'/video/create',
        name:"videoCreate",
        component:VideoEdit
        },
      {
        path:'/video/edit/:id',
        name:"videoEdit",
        component:VideoEdit,
        props:true
      },
      {
        path:'/video/commend/list',
        name:"videoCommendList",
        component:VideoCommendList
      },
      {
        path:'/admin/list',
        name:"adminList",
        component:AdminList
      },
      {
        path:'/admin/create',
        name:"adminCreate",
        component:AdminEdit
        },
      {
        path:'/admin/edit/:id',
        name:"adminEdit",
        component:AdminEdit,
        props:true
      },
      {
        path:'/user/list',
        name:"userList",
        component:UserList
      },
      {
        path:'/user/data/:id',
        name:"userData",
        component:UserData,
        props:true
      },
      {
        path:'/equipType/list',
        name:"equipTypeList",
        component:EquipTypeList
      },
      {
        path:'/equipType/create',
        name:"equipTypeCreate",
        component:EquipTypeEdit
        },
      {
        path:'/equipType/edit/:id',
        name:"equipTypeEdit",
        component:EquipTypeEdit,
        props:true
      },
      {
        path:'/product/list',
        name:"productList",
        component:ProductList
      },
      {
        path:'/product/create',
        name:"productCreate",
        component:ProductEdit
        },
      {
        path:'/product/edit/:id',
        name:"productEdit",
        component:ProductEdit,
        props:true
      },
      {
        path:'/ads/list',
        name:"adList",
        component:AdList
      },
      {
        path:'/ads/create',
        name:"adCreate",
        component:AdEdit
        },
      {
        path:'/ads/edit/:id',
        name:"adEdit",
        component:AdEdit,
        props:true
      },

      {
        path:'/player/list',
        name:"playerList",
        component:PlayerList
      },
      {
        path:'/player/create',
        name:"playerCreate",
        component:PlayerEdit
        },
      {
        path:'/player/edit/:id',
        name:"playerEdit",
        component:PlayerEdit,
        props:true
      },
      {
        path:'/match/list',
        name:"matchList",
        component:MatchList
      },
      {
        path:'/match/create',
        name:"matchCreate",
        component:MatchEdit
        },
      {
        path:'/match/edit/:id',
        name:"matchEdit",
        component:MatchEdit,
        props:true
      },
      {
        path:'/contest/list',
        name:"contestList",
        component:ContestList
      },
      {
        path:'/contest/create',
        name:"contestCreate",
        component:ContestEdit
        },
      {
        path:'/contest/edit/:id',
        name:"contestEdit",
        component:ContestEdit,
        props:true
      },
      
      {
        path:'/post/list',
        name:"postList",
        component:PostList
        },
      {
        path:'/post/:id',
        name:"postDetail",
        component:PostDetail,
        props:true
      },

      {
        path:'/temp/list',
        name:"tempList",
        component:TempList
        },
      ]
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(!(to.meta.isLimit) &&!(localStorage.getItem('token'))){
   next('/login')
  }else{
    next()
  }
  
})

export default router;