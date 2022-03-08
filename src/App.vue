<script lang="ts" setup>
import IPC from './ipc'
import { onMounted } from 'vue'
import { useStore } from '@/store'
import AppUpdate from './utils/AppUpdate'
import { message, notification } from 'ant-design-vue'

import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

moment.locale('zh-cn')

const Store = useStore()

notification.config({
    placement: 'bottomRight'
})

message.config({
    top: '40vh'
})

if (Store.state.app.electron) {
    // 监听主进程消息通知
    require('electron').ipcRenderer.on(IPC.NOTICE, (...args) => notification.open(args[1]))
    // 监听主进程 console.log 并打印
    require('electron').ipcRenderer.on(IPC.CONSOLE_LOG, (_, ...args) => console.log('主进程:', ...args))
    // 注册键盘事件用于打开控制台
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        e.key === 'F12' && require('electron').ipcRenderer.invoke(IPC.OPEN_DEV_TOOLS)
    })
}

onMounted(() => {
    if (Store.state.app.electron && Store.state.app.isPackaged) {
        AppUpdate.init()
        AppUpdate.check(false)
    }
})
</script>

<template>
    <a-config-provider :locale="zhCN">
        <router-view />
    </a-config-provider>
</template>

<style lang="scss">
@import "@/styles/index.scss";
</style>
