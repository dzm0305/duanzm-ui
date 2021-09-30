import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//auth文件主要依赖js-cookie模块，把getToken，setToken，removeToken设置在这里
import { getToken } from '@/utils/auth'

//NProgress是封装的进度条，基本不用动
NProgress.configure({ showSpinner: false })

//路由白名单列表，把路由添加到这个数组，不用登陆也可以访问
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  // 请求路由时进度条开始
  NProgress.start()
  // 这里的getToken()就是在上面导入的auth.js里的getToken()方法,如果存在token，即存在已登陆的令牌
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    //如果用户存在令牌的情况请求登录页面，就让用户直接跳转到首页，避免存在重复登录的情况
    if (to.path === '/login') {
      next({ path: '/' })
      //一定要关闭进度条
      NProgress.done()
    } else {
      //如果已经有令牌的用户请求的不是登录页，是其他页面。就从Vuex里拿到用户的信息，这里也证明用户不是第一次登录了,通过Vuex设置用户信息
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息,访问 @store/modules/user.js下的 GetInfo
        store.dispatch('GetInfo').then(() => {
          //访问 @store/modules/permission.js下的 GetInfo
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token, whiteList.indexOf(to.path) !== -1)判断用户请求的路由是否在白名单里
    if (whiteList.indexOf(to.path) !== -1) {
      // 不是-1就证明在免登录白名单，不管你有没有令牌，都直接去到白名单路由对应的页面
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  //每次请求结束后都需要关闭进度条
  NProgress.done()
})
