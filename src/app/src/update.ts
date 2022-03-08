import fs from 'fs'
import IPC from '@/ipc'
import path from 'path'
import { notice, isNewWebVersion } from './utils'
import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater, UpdateInfo } from 'electron-updater'

/**
 * @description: 应用检查更新相关逻辑
 * @param {BrowserWindow} window
 * @return {*}
 */
let CHECK_UPDATA_BY_HAND = false
let UPDATA_DOWNLOADED_NOT_INSTALLED = false
export { autoUpdater, UPDATA_DOWNLOADED_NOT_INSTALLED }
export default (window: BrowserWindow): void => {
    // 点击 检查更新
    ipcMain.handle(IPC.CHECK_UPDATA, (...args) => {
        CHECK_UPDATA_BY_HAND = args[1]
        // 只有用户点击 检查更新才弹出提示框
        CHECK_UPDATA_BY_HAND && notice(window, 'info', '检查更新', '正在检查更新')
        // 先判断 web 版本有无更新，再判断 壳 版本
        isNewWebVersion(fs.readFileSync(path.join(__dirname, '/index.js')).toString())
            .then(({ isNewWebVersion }) => {
                if (isNewWebVersion) {
                    window.webContents.send(IPC.CHECKED_NEW_WEB)
                } else {
                    autoUpdater.checkForUpdatesAndNotify()
                }
            })
            .catch(() => notice(window, 'error', '检查更新', '检查更新异常，请联系管理员'))
    })

    // 点击 立即更新
    ipcMain.handle(IPC.UPDATA_QUITANDINSTALL, () => {
        autoUpdater.quitAndInstall()
    })

    // 取消 立即更新
    ipcMain.handle(IPC.UPDATA_DOWNLOADED_NOT_INSTALLED, () => {
        UPDATA_DOWNLOADED_NOT_INSTALLED = true
    })

    // 检查更新出错
    autoUpdater.on('error', (error: Error) => {
        notice(window, 'error', '检查更新出错', error.message)
        CHECK_UPDATA_BY_HAND = false
    })

    // 检查到新版本
    autoUpdater.on('update-available', (info: UpdateInfo) => {
        notice(window, 'success', '检查到新版本', `检查到新版本 V${info.version}.${process.env.VERSION} 开始下载，下载完成后将提示安装`)
        CHECK_UPDATA_BY_HAND = false
    })

    // 已经是新版本
    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
        CHECK_UPDATA_BY_HAND && notice(window, 'success', '已经是新版本', `当前版本 V${info.version}.${process.env.VERSION} 为最新版本`)
        CHECK_UPDATA_BY_HAND = false
    })

    // 更新下载中
    autoUpdater.on('download-progress', ({ percent }: { percent: number }) => {
        window.setProgressBar(percent / 100)
    })

    // 更新下载完毕
    autoUpdater.on('update-downloaded', () => {
        window.webContents.send(IPC.UPDATA_DOWNLOADED)
    })
}
