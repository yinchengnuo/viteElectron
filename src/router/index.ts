import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'

import Store from '@/store'
import routes from './routes'

NProgress.configure({
    showSpinner: false
})

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/首页',
            component: () => import('@/layout/Layout.vue'),
            children: [
                {
                    path: '/登录',
                    component: () => import('@/pages/Login/Login.vue')
                },
                {
                    path: '/',
                    redirect: '/首页',
                    component: () => import('@/layout/components/ViewBar/ViewBar.vue'),
                    children: [
                        {
                            path: '/首页',
                            component: () => import('@/pages/首页/首页.vue')
                        },
                        ...routes,
                        {
                            path: '/401',
                            component: () => import('@/pages/401/401.vue')
                        },
                        {
                            path: '/404',
                            component: () => import('@/pages/404/404.vue')
                        }
                    ]
                }
            ]
        }
    ]
})

router.beforeEach(async ({ path }, from) => {
    if (path !== decodeURIComponent(path)) {
        return {
            replace: true,
            path: decodeURIComponent(path)
        }
    }
    NProgress.start()
    // 如果进入登录页，表示退出登录的
    if (path === '/登录') {
        // 清空缓存
        sessionStorage.clear()
        Store.commit('tab/CLEAR')
        Store.commit('userinfo/CLEAR_USERINFO')
    } else {
        // 如果进入 routes 不存在的页面，重定向 404
        if (!router.getRoutes().find((e) => e.path === path)) {
            return {
                path: '/404',
                replace: true
            }
        }
        // 如果进入 routes 存在的但是用户菜单不存在的页面，重定向 401
        // if (xxx) {
        //     return {
        //         path: '/401',
        //         replace: true
        //     }
        // }
        Store.commit('tab/ADD_TAB', { path })
    }
    // 退出登录，页面向下滑动
    if (path === '/首页' && from.path === '/登录') {
        Store.commit('app/UPDATA_LOGIN_TRANSITION_NAME', 'view-login')
    }
    // 登录成功，页面向上滑动
    if (path === '/登录' && from.path === '/首页') {
        Store.commit('app/UPDATA_LOGIN_TRANSITION_NAME', 'view-logout')
    }
    // 如果用户未登录，进入登录页
    if (path !== '/登录' && !sessionStorage.getItem('userinfo')) {
        return {
            replace: true,
            path: '/登录'
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router
