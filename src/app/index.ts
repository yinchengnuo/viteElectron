import fs from 'fs'
import path from 'path'
import { app, BrowserWindow } from 'electron'

import dev from './src/dev'
import init from './src/init'
import print from './src/print'
import serial from './src/serial'
import update from './src/update'
import { relaunch, isNewWebVersion, loadWebStatic, notice } from './src/utils'

// 不显示 electron 控制台安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = undefined

app.whenReady().then(() => {
    // 初始化 widnow
    const window = new BrowserWindow({
        show: false, // 默认不显示
        frame: false, // 自定义边框
        webPreferences: {
            webSecurity: false, // 允许跨域
            nodeIntegration: true, // 允许在渲染进程使用 node
            contextIsolation: false // 取消进程隔离
        }
    })

    // 打包后
    if (app.isPackaged) {
        if (fs.readdirSync(__dirname).includes('_index.js')) {
            window.loadURL(process.env.URL || '')
            // 下载远程 web 资源
            loadWebStatic()
        } else {
            // 下载主进程代码
            isNewWebVersion(fs.readFileSync(path.join(__dirname, '/index.js')).toString())
                .then(({ isNewWebVersion, newAppCode, oldAppCode }) => {
                    // 如果有新版本
                    if (isNewWebVersion) {
                        fs.writeFileSync(path.join(__dirname, '/_index.js'), oldAppCode) // 备份当前主进程代码
                        fs.writeFileSync(path.join(__dirname, '/index.js'), newAppCode || '') // 替换当前主进程代码为最新
                        relaunch() // 重启应用
                    } else {
                        // 如果没有新版本，加载本地 web 资源
                        window.loadFile('dist/index.html')
                    }
                })
                .catch(() => {
                    // 主进程代码下载出错，加载本地 web 资源
                    window.loadFile('dist/index.html')
                    window.once('ready-to-show', () => {
                        notice(window, 'error', '检查更新', '检查更新异常，请联系管理员')
                    })
                })
        }
    } else {
        // 开发环境
        window.loadURL('http://localhost:3000/')
    }

    // 渲染进程渲染完成显示窗口，用于优化首次打开白屏时间闪烁
    window.on('ready-to-show', () => {
        if (process.platform === 'win32') {
            window.maximize()
        }
        if (process.platform === 'darwin') {
            window.setFullScreen(true)
        }
        // 显示渲染进程窗口
        window.show()
    })

    // 开发调试
    dev(window)
    // 初始化应用
    init(window)
    // 初始化打印
    print(window)
    // 初始化串口
    serial(window)
    // 初始化应用更新
    update(window)
})

// 全部渲染进程关闭退出应用
app.on('window-all-closed', () => {
    app.quit()
})
