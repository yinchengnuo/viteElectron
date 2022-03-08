import { Module } from 'vuex'

export interface Userinfo {
    username: string;
    password: string;
}

const userinfo: Module<Userinfo, unknown> = {
    namespaced: true,
    state: {
        username: '',
        password: ''
    },
    mutations: {
        // 获取到用户信息
        GOT_USERINFO (state, payload) {
            Object.assign(state, payload)
        },
        // 清除用户信息
        CLEAR_USERINFO (state, payload) {
            state.username = ''
            state.password = ''
        }
    }
}

export default userinfo
