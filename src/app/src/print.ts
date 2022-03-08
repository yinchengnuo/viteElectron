import ipc from '@/ipc'
import { BrowserWindow, ipcMain } from 'electron'

/**
 * @description: 初始化打印机相关
 * @param {BrowserWindow} window
 * @return {void}
 */
export default (window: BrowserWindow): void => {
    // 获取打印机列表
    ipcMain.handle(ipc.GET_PRINTER_LIST, () => {
        return window.webContents.getPrintersAsync()
    })
}
