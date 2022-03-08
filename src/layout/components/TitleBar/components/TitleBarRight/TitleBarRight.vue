<script setup lang="ts">
import IPC from '@/ipc'
import { useStore } from '@/store'
import { Modal } from 'ant-design-vue'
import AppUpdate from '@/utils/AppUpdate'
import { MinusOutlined, CloseOutlined, ZoomOutOutlined, ReloadOutlined, ZoomInOutlined } from '@ant-design/icons-vue'

const Store = useStore()

// 最小化
const mini = () => {
    require('electron').ipcRenderer.invoke(IPC.APP_MINI)
}

// 退出应用
const close = () => {
    Modal.confirm({
        title: '提示',
        centered: true,
        content: '确认关闭车间管理系统？',
        onOk () {
            require('electron').ipcRenderer.invoke(IPC.APP_QUIT)
        }
    })
}
</script>

<template>
    <div class="title_bar_right flex1 h100 flex flex_fe">
        <a-dropdown v-if="Store.state.app.dev && Store.state.app.electron && !Store.state.app.isPackaged">
            <a-tooltip title="此按钮仅在开发环境出现" placement="left">
                <a-button class="mr8" size="small" type="primary" danger>开发调试</a-button>
            </a-tooltip>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="require('electron').ipcRenderer.invoke(IPC.OPEN_DEV_TOOLS)">控制台</a-menu-item>
                    <a-menu-item @click="require('electron').shell.openExternal('http://localhost:3000')">web版</a-menu-item>
                    <a-menu-item @click="require('electron').shell.openExternal('http://localhost:4000')">开发文档</a-menu-item>
                    <a-menu-item @click="require('electron').shell.openExternal('http://localhost:3000/__inspect')">依赖检查</a-menu-item>
                    <a-menu-item @click="require('electron').ipcRenderer.invoke(IPC.BUILD_DEV)">测试打包</a-menu-item>
                    <a-menu-item @click="require('electron').ipcRenderer.invoke(IPC.BUILD_PRO)">正式打包</a-menu-item>
                    <a-menu-item @click="require('electron').ipcRenderer.invoke(IPC.OPEN_VUE_DEV_TOOLS)">vue-devtools</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-button v-if="Store.state.app.electron" class="mr8" size="small" shape="circle" @click="window.location.reload()">
            <template #icon><ReloadOutlined /></template>
        </a-button>
        <a-button v-if="Store.state.app.electron" class="mr4" size="small" shape="circle" @click="Store.commit('app/ZOOM_APP', Store.state.app.zoom - 0.2)">
            <template #icon><ZoomOutOutlined /></template>
        </a-button>
        <a-button v-if="Store.state.app.electron" size="small" shape="circle" @click="Store.commit('app/ZOOM_APP', Store.state.app.zoom + 0.2)">
            <template #icon><ZoomInOutlined /></template>
        </a-button>
        <a-dropdown v-if="Store.state.userinfo.username">
            <a-button type="link">{{ Store.state.userinfo.username }}</a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="$router.push('/首页')">首页</a-menu-item>
                    <a-menu-item @click="$router.replace('/登录')">退出登录</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-dropdown>
            <a-tag class="pointer" :class="Store.state.userinfo.username ? '' : 'ml8'">V{{ Store.state.app.version }}.{{ Store.state.app.VERSION }}</a-tag>
            <template v-if="Store.state.app.electron && Store.state.app.isPackaged" #overlay>
                <a-menu>
                    <a-menu-item @click="AppUpdate.check(true)">检查更新</a-menu-item>
                    <a-menu-item @click="require('electron').ipcRenderer.invoke(IPC.RELAUNCH)">重启应用</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>

        <a-button v-if="Store.state.app.electron" @click="mini">
            <template #icon><MinusOutlined /></template>
        </a-button>
        <a-button v-if="Store.state.app.electron" @click="close">
            <template #icon><CloseOutlined /></template>
        </a-button>
    </div>
</template>
