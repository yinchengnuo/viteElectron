import fs from 'fs'
import IPC from '@/ipc'
import path from 'path'
import axios from 'axios'
import { notice, command, kill } from './utils'
import { ChildProcess } from 'child_process'
import { BrowserWindow, ipcMain, shell } from 'electron'

/**
 * @description: 初始化 window
 * @param {BrowserWindow} window
 * @return {*}
 */
export default (window: BrowserWindow): void => {
    // package.json
    const Package = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString())
    const productName = `${Package.build.productName}_${Package.version}.${Package.VERSION}`

    // 测试打包
    let building: ChildProcess | undefined
    ipcMain.handle(IPC.BUILD_DEV, () => {
        // 如果打包进程正在运行
        if (building) {
            // 渲染进程弹出提示
            notice(window, 'warning', '测试打包', '正在打包')
            return
        }
        // 启动打包进程
        building = command('node index.js --mode=development')
        // 打包进程启动成功，渲染进程弹出提示
        building.once('spawn', () => {
            notice(window, 'warning', '测试打包', '正在打包，打包过程中请勿修改代码', { key: 'building', duration: null })
        })
        // 打包完成
        building.on('exit', () => {
            // 标记进程状态
            building = undefined
            // 打开构建的安装包目录
            process.platform === 'darwin'
                ? shell.showItemInFolder(path.resolve(`./mac/development/测试环境${productName}.dmg`))
                : shell.showItemInFolder(path.resolve(`./build/测试环境${productName}.exe`))
            // 渲染进程弹出提示
            notice(window, 'success', '测试打包', '打包完成', { key: 'building', duration: null })
        })
    })

    // 正式打包
    ipcMain.handle(IPC.BUILD_PRO, () => {
        // 如果打包进程正在运行
        if (building) {
            // 渲染进程弹出提示
            notice(window, 'warning', '正式打包', '正在打包')
            return
        }
        // 启动打包进程
        building = command('node index.js --mode=production')
        // 打包进程启动成功，渲染进程弹出提示
        building.once('spawn', () => {
            notice(window, 'warning', '正式打包', '正在打包，打包过程中请勿修改代码', { key: 'building', duration: null })
        })
        // 打包完成
        building.on('exit', () => {
            // 标记进程状态
            building = undefined
            // 打开构建的安装包目录
            process.platform === 'darwin'
                ? shell.showItemInFolder(path.resolve(`./mac/production/${productName}.dmg`))
                : shell.showItemInFolder(path.resolve(`./build/${productName}.exe`))
            // 渲染进程弹出提示
            notice(window, 'success', '正式打包', '打包完成', { key: 'building', duration: null })
        })
    })

    // vue-devtools
    let vueDevTools: ChildProcess | undefined
    // vue-devtools 对应的渲染进程处理
    const connectVueDevTools = () => {
        // 当 vueDevTools 进程存在，渲染进程插入连接 vueDevTools 脚本
        vueDevTools &&
            axios.get('http://localhost:8098').then(({ data }) => {
                window.webContents.executeJavaScript(data)
            })
        // 根据 vueDevTools 进程的存在状态，渲染进程的进一步处理
        window.webContents.once('did-finish-load', () => {
            // vueDevTools 进程存在，渲染进程弹出提示
            if (vueDevTools) {
                notice(window, 'success', 'vue-devtools', 'vue-devtools 已启动并连接，若未连接刷新页面即可')
            } else {
                // vueDevTools 进程不存在，关闭渲染进程事件监听并提示
                notice(window, 'success', 'vue-devtools', 'vue-devtools 已关闭')
                window.webContents.removeListener('dom-ready', connectVueDevTools)
            }
        })
    }
    // 打开 vueDevTools 进程
    ipcMain.handle(IPC.OPEN_VUE_DEV_TOOLS, async () => {
        // vueDevTools 进程已打开，关闭 vueDevTools
        if (vueDevTools) {
            kill(vueDevTools)
            return
        }
        // 打开 vueDevTools 进程
        vueDevTools = command('electron node_modules/@vue/devtools/app.js')
        // 进程启动成功，为渲染进程添加连接 vueDevTools 处理
        vueDevTools.once('spawn', () => {
            window.webContents.addListener('dom-ready', connectVueDevTools)
            // 延时刷新渲染进程（vue-devtools的实现导致必须延时）
            setTimeout(() => {
                window.reload()
            }, 2333)
        })
        // vueDevTools 进程被关闭
        vueDevTools.on('exit', () => {
            window.reload()
            vueDevTools = undefined
        })
    })
}
