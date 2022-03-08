import { Module } from 'vuex'

export type Menu = Array<{}>;

const menu: Module<Menu, unknown> = {
    namespaced: true,
    state: [],
    mutations: {}
}

export default menu
