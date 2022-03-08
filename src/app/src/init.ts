import IPC from '@/ipc'
import { app, BrowserWindow, ipcMain } from 'electron'
import { UPDATA_DOWNLOADED_NOT_INSTALLED } from './update'
import { relaunch } from './utils'

/**
 * @description: 初始化 window
 * @param {BrowserWindow} window
 * @return {*}
 */
export default (window: BrowserWindow): void => {
    // 重写 consoel.log 方法监听输入流发送到渲染进程
    const log = console.log
    global.console.log = (...args) => {
        window.webContents.send(IPC.CONSOLE_LOG, ...args.map((e) => e.toString()))
        log(...args)
    }
    // 重启应用
    ipcMain.handle(IPC.RELAUNCH, () => relaunch())
    // 是否已打包
    ipcMain.handle(IPC.IS_PACKAGED, () => app.isPackaged)
    // 打开 devtools
    ipcMain.handle(IPC.OPEN_DEV_TOOLS, () => {
        !window.webContents.isDevToolsOpened() &&
            window.webContents.once('devtools-opened', () => {
                window.webContents.focus()
            })
        window.webContents.toggleDevTools()
    })
    // 最小化
    ipcMain.handle(IPC.APP_MINI, () => {
        if (process.platform === 'darwin') {
            window.setFullScreen(false)
            window.once('leave-full-screen', () => {
                window.once('restore', () => {
                    window.setFullScreen(true)
                })
                window.minimize()
            })
        } else {
            window.minimize()
        }
    })
    // 自动更新准备就绪关闭时强制更新
    ipcMain.handle(IPC.APP_QUIT, (e) => {
        if (UPDATA_DOWNLOADED_NOT_INSTALLED) {
            window.webContents.send(IPC.UPDATA_DOWNLOADED_QUIT_INSTALL)
        } else {
            app.quit()
        }
    })

    // 注册外部唤起协议
    app.setAsDefaultProtocolClient('myrs')
    // 允许所有权限
    window.webContents.session.setPermissionCheckHandler(() => true)
    window.webContents.session.setDevicePermissionHandler(() => true)
    window.webContents.session.setPermissionRequestHandler((_, __, callback) => {
        const flag = true
        return callback(flag)
    })
}
