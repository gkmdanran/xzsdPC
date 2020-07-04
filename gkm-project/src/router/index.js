import Vue from 'vue'
import Router from 'vue-router'
import pclogin from '@/components/pclogin'
import pchomepages from '@/components/pchomepages'
import pcuser from '@/components/pcuser'
import pchome from '@/components/pchome'
import pcmenu from '@/components/pcmenu'
import pcgoods from '@/components/pcgoods'
import pccustomer from '@/components/pccustomer'
import pckinds from '@/components/pckinds'
import pcshop from '@/components/pcshop'
import pcdriver from '@/components/pcdriver'
import pcbanners from '@/components/pcbanners'
import pcorders from '@/components/pcorders'
import pchots from '@/components/pchots'
Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      name: 'pclogin',
      component: pclogin
    },
    {
      path: '/pchomepages',
      name: 'pchomepages',
      component: pchomepages,
      redirect:'/pchome',
      children:[
        {
          path: '/pcuser',
          name: '/pcuser',
          component: pcuser,
        },
        {
          path: '/pchome',
          name: '/pchome',
          component: pchome,
        },
        {
          path: '/pcmenu',
          name: '/pcmenu',
          component: pcmenu,
        },
        {
          path: '/pcgoods',
          name: '/pcgoods',
          component: pcgoods,
        },
        {
          path: '/pccustomer',
          name: '/pccustomer',
          component: pccustomer,
        },
        {
          path: '/pckinds',
          name: '/pckinds',
          component: pckinds,
        },
        {
          path: '/pcshop',
          name: '/pcshop',
          component: pcshop,
        },
        {
          path: '/pcdriver',
          name: '/pcdriver',
          component: pcdriver,
        },
        {
          path: '/pcbanners',
          name: '/pcbanners',
          component: pcbanners,
        },
        {
          path: '/pcorders',
          name: '/pcorders',
          component: pcorders,
        },
        {
          path: '/pchots',
          name: '/pchots',
          component: pchots,
        }
      ]
    },
  ],
  // mode:"history"
})

router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next()直接放行 next('/login)强制跳转到login
  if(to.path=="/")return next();
  const tokenStr=window.sessionStorage.getItem('xzsdtoken')
  if(!tokenStr) return next("/")
  next()
})
export default router
