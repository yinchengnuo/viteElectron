import { InjectionKey } from 'vue'
import app, { App } from './modules/app'
import tab, { Tab } from './modules/tab'
import LocalStorage from '@/utils/LocalStorage'
import userinfo, { Userinfo } from './modules/userinfo'
import { createStore, Store, useStore as USESTORE } from 'vuex'
import IPC from '@/ipc'

interface State {
    app: App;
    tab: Tab;
    userinfo: Userinfo;
}
type StoreState = Store<{ app: App; tab: Tab; userinfo: Userinfo }>;

export const key: InjectionKey<StoreState> = Symbol('')
export const useStore = () => USESTORE(key)

const store = createStore({
    strict: true,
    modules: {
        app,
        tab,
        userinfo
    },
    plugins: [
        (store) => {
            store.subscribe((mutation, state: unknown | State) => {
                // tab 变化实时映射到 sessionStorage 用于刷新后保持 tab 状态
                if (mutation.type.startsWith('tab')) {
                    if (document.readyState === 'complete') {
                        sessionStorage.setItem('tab', JSON.stringify((state as State).tab.map((e) => e.path)))
                    }
                }
            })
        }
    ]
}) as StoreState

// 打开后从缓存读取 zoom
LocalStorage.get('zoom').then((zoom) => {
    store.commit('app/ZOOM_APP', zoom || 0)
})

// 从缓存读取用户信息
if (sessionStorage.length) {
    try {
        store.commit('userinfo/GOT_USERINFO', JSON.parse(sessionStorage.getItem('userinfo') || '{}') as Userinfo)
    } catch (error) {}
}

// 获取 electron 是否已打包
store.state.app.electron &&
    require('electron')
        .ipcRenderer.invoke(IPC.IS_PACKAGED)
        .then((isPackaged: Boolean) => {
            store.commit('app/IS_PACKAGED', isPackaged)
        })
// 应用加载完成从缓存读取 tab 列表
document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        store.commit('tab/ADD_TAB_FROM_CACHE')
    }
})

export default store
