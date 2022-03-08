import { Module } from 'vuex'
import { RouteRecordRaw } from 'vue-router'

import Router from '@/router'

export type Tab = RouteRecordRaw[];

const getRouteByPath = (path: string): RouteRecordRaw => Router.getRoutes().find((e) => e.path === path) as RouteRecordRaw

const tab: Module<Tab, unknown> = {
    namespaced: true,
    state: [],
    mutations: {
        // 添加 tab
        ADD_TAB (state, { path }) {
            // 如果 tab 中不存在该路由
            if (!state.find((e) => e.path === path)) {
                // 往 tab 中添加该路由
                state.push(getRouteByPath(path))
            }
        },
        // 从 sessionStorage 中获取缓存的 tab，一般用于刷新后保持上次 tab 栏
        ADD_TAB_FROM_CACHE (state) {
            try {
                JSON.parse(sessionStorage.getItem('tab') || '[]').forEach((path: string, index: number) => {
                    state[index] = getRouteByPath(path)
                })
                if (!state.length) {
                    Router.replace('/首页')
                }
            } catch (error) {
                state.length = 0
                Router.replace('/首页')
            }
        },
        // 关闭 tab
        DEL_TAB (state, { path }) {
            // 如果是关闭当前页时下一个应该打开的页面
            let nextPath = ''
            // 要关闭的 tab 下标
            const index = state.findIndex((e) => e.path === path)
            // 如果要关闭的页面是当前页，计算下一个要打开的页面
            if (Router.currentRoute.value.path === path) {
                // 如果右侧页面存在，打开右侧页面
                if (state[index + 1]) {
                    nextPath = state[index + 1].path
                }
                // 如果右侧页面不存在且存在左侧页面，打开左侧页面
                if (!state[index + 1] && index - 1 >= 0) {
                    nextPath = state[index - 1].path
                }
            }
            // 删除要关闭的 tab
            state.splice(index, 1)
            // 如果删除后的 tab 长度不为空，表示 nextPath 不为空，直接跳转
            if (state.length) {
                Router.replace(nextPath)
            } else {
                // 如果删除后的 tab 长度为空，表示关闭了全部 tab，跳转到首页
                if (Router.currentRoute.value.path === '/首页') {
                    state.push(getRouteByPath('/首页'))
                } else {
                    Router.replace('/首页')
                }
            }
        },
        // 删除全部
        DEL_ALL (state) {
            // 清空 tab 列表
            state.length = 0
            // 跳转到首页
            if (Router.currentRoute.value.path === '/首页') {
                state.push(getRouteByPath('/首页'))
            } else {
                Router.replace('/首页')
            }
        },
        // 删除其他
        DEL_OTHER (state) {
            state[0] = state[state.findIndex((e) => e.path === Router.currentRoute.value.path)]
            state.splice(1)
        },
        // 清空 tab 栏
        CLEAR (state) {
            state.length = 0
        }
    }
}

export default tab
