import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import MyMusic from '@/pages/MyMusic'
import Singer from '@/pages/Singer'
import SongList from '@/pages/SongList'
import Search from '@/pages/Search'
import Lyric from '@/pages/Lyric'
import SignUp from '@/pages/SignUp'
import LoginIn from '@/pages/LoginIn'
import Setting from '@/pages/Setting'
import SongListAlbum from '@/pages/SongListAlbum'
import SingerAlbum from '@/pages/SingerAlbum'


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(Router)

export default new Router({
  routes: [    
    {
      path: '/',
      name: 'home',
      component: Home,
      
    },
    {
      path: '/song-list',
      name: 'songList',
      component: SongList
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer
    },
    {
      path: '/my-music',
      name: 'my-music',
      component: MyMusic
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/lyric',
      name: 'lyric',
      component: Lyric
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp
    },
    {
      path: '/login-in',
      name: 'login-in',
      component: LoginIn
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },
    {
      path: '/song-list-album/:id',
      name: 'song-list-album',
      component: SongListAlbum
    },
    {
      path: '/singer-album/:id',
      name: 'singer-album',
      component: SingerAlbum
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
