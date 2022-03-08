import { Module } from 'vuex'
import { version, VERSION } from '@/../package.json'
import Store from '@/store'
import LocalStorage from '@/utils/LocalStorage'

export interface App {
    dev: boolean; // 是否运行在开发模式
    zoom: number; // 应用缩放等级
    version: string; // app 版本
    VERSION: string; // web 版本
    electron: boolean; // 是否运行在 electron 中运行
    isPackaged: boolean; // electron 是否已打包
    loginTransitionName: string; // 登录切换动画
}

const app: Module<App, unknown> = {
    namespaced: true,
    state: {
        zoom: 1,
        version,
        VERSION,
        isPackaged: false,
        dev: import.meta.env.DEV,
        electron: Boolean(window.require),
        loginTransitionName: 'view-login'
    },
    getters: {
        alives () {
            return Store.state.tab.map((e) => e.path)
        }
    },
    mutations: {
        // 登录切换动画
        UPDATA_LOGIN_TRANSITION_NAME (state, loginTransitionName) {
            state.loginTransitionName = loginTransitionName
        },
        // 缩放应用
        IS_PACKAGED (state, isPackaged: boolean) {
            state.isPackaged = isPackaged
        },
        // 缩放应用
        ZOOM_APP (state, zoom: number) {
            zoom = +zoom.toFixed(2)
            if (zoom >= 0 && zoom <= 3) {
                state.zoom = zoom
                LocalStorage.set('zoom', zoom)
                state.electron && require('electron').webFrame.setZoomLevel(zoom)
            }
        }
    }
}

export default app
