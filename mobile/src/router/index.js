import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/main/Login.vue'
import Register from '../views/main/Register.vue'
import Main from '../views/main/Main.vue'

import Article from '../views/home/Main.vue'
import ArticleDetail from '../views/home/ArtcleDetail.vue'
import ArtcleCommend from '../views/home/ArtcleCommend.vue'
import ArticleType from '../views/home/ArticleType.vue'
import Player from '../views/home/Player.vue'


import Personal from '../views/personal/Main.vue'
import Avatar from '../views/personal/Avatar.vue'
import Info from '../views/personal/Info.vue'
import InfoEdit from '../views/personal/InfoEdit.vue'
import ArtCollect from '../views/personal/ArtCollect.vue'
import MyCommend from '../views/personal/MyCommend.vue'
import PostCollect from '../views/personal/PostCollect.vue'
import PostCommend from '../views/personal/PostCommend.vue'
import VideoCollect from '../views/personal/VideoCollect.vue'
import ResetPwd from '../views/personal/ResetPwd.vue'
import CallUs from '../views/personal/CallUs.vue'

import Forum from '../views/forum/Main.vue'
import PostEdit from '../views/forum/PostEdit.vue'
import PostDetail from '../views/forum/PostDetail.vue'

import Video from '../views/video/Main.vue'
import VideoDetail from '../views/video/VideoDetail.vue'

import Equip from '../views/equip/Main.vue'
import EquipList from '../views/equip/Equip.vue'
import Product from '../views/equip/Product.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/main/article'
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    children:[{
      path:'article',
      name:'article',
      component:Article
    },
    {
      path:'video',
      name:'video',
      component:Video
    },
    {
      path:'equip',
      name:'equip',
      component:Equip
    },
    {
      path:'forum',
      name:'forum',
      component:Forum
    },
    {
      path:'personal',
      name:'personal',
      component:Personal
    }]
  },
  {
    path:'/main/article/detail/:id',
    name:'articleDetail',
    component:ArticleDetail,
    props:true
  },
  {
    path:'/main/article/detail/commend/:id',
    name:'ArtcleCommend',
    component:ArtcleCommend,
    props:true
  },
  {
    path:'/main/article/type/:id',
    name:'ArticleType',
    component:ArticleType,
    props:true
  },
  {
    path:'/main/player/:id',
    name:'player',
    component:Player,
    props:true
  },
  {
    path:'video/:id',
    name:'videoDetail',
    component:VideoDetail,
    props:true
  },
  {
    path:'/main/personal/avatar',
    name:'avatar',
    component:Avatar
  },
  {
    path:'/main/personal/info',
    name:'info',
    component:Info
  },
  {
    path:'/main/personal/info/infoEdit',
    name:'infoEdit',
    component:InfoEdit
  },  
  {
    path:'/main/personal/artCollect/:id',
    name:'artCollect',
    component:ArtCollect,
    props:true
  },
  {
    path:'/main/personal/myCommend/:id',
    name:'myCommend',
    component:MyCommend,
    props:true
  },
  {
    path:'/main/personal/postCollect/:id',
    name:'postCollect',
    component:PostCollect,
    props:true
  },
  {
    path:'/main/personal/postCommend/:id',
    name:'postCommend',
    component:PostCommend,
    props:true
  },
  {
    path:'/main/personal/videoCollect/:id',
    name:'videoCollect',
    component:VideoCollect,
    props:true
  },
  {
    path:'/main/personal/info/resetPwd',
    name:'resetPwd',
    component:ResetPwd
  },
  {
    path:'/main/personal/product/:id',
    name:'productCollect',
    component:EquipList,
    props:true
  }, 
  {
    path:'/main/personal/callus',
    name:'callus',
    component:CallUs
  },
  {
    path:'/main/equip/list/:id',
    name:'equipList',
    component:EquipList,
    props:true
  },
  {
    path:'/main/equip/product/:id',
    name:'product',
    component:Product,
    props:true
  },
  {
    path:'/main/forum/postCreate',
    name:'postCreate',
    component:PostEdit
  },
  {
    path:'/main/forum/postEdit/:id',
    name:'postEdit',
    component:PostEdit,
    props:true
  },
  {
    path:'/main/forum/postDetail/:id',
    name:'postDetail',
    component:PostDetail,
    props:true
  },
  {
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path:'/register',
    name:'register',
    component:Register
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
